
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { geminiService } from '../services/geminiService';
import { MicIcon, LoaderIcon, PaperclipIcon, XIcon } from './Icons';
import { LiveServerMessage } from '@google/genai';
import { audioUtils } from '../utils/audio';
import { useNotes } from '../hooks/useNotes';
import { useFarmProfile, FarmProfile } from '../hooks/useFarmProfile';
import { useLanguage } from '../hooks/useLanguage';

const FRAME_COUNT = 5;

export const LiveTalk = () => {
    const [isConnecting, setIsConnecting] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [userSaid, setUserSaid] = useState<string>('');
    const [botSaid, setBotSaid] = useState<string>('');
    const [file, setFile] = useState<File | null>(null);
    const [filePreview, setFilePreview] = useState<string | null>(null);

    const { addNote } = useNotes();
    const { profile, updateProfile, resetProfile } = useFarmProfile();
    const { t, language } = useLanguage();
    
    const sessionPromiseRef = useRef<ReturnType<typeof geminiService.startLiveSession> | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const inputAudioContextRef = useRef<AudioContext | null>(null);
    const outputAudioContextRef = useRef<AudioContext | null>(null);
    const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
    const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    
    const userSaidRef = useRef('');
    const botSaidRef = useRef('');
    const nextStartTimeRef = useRef(0);
    const sourcesRef = useRef(new Set<AudioBufferSourceNode>());

    const extractFrames = useCallback(async (videoFile: File): Promise<string[]> => {
        return new Promise((resolve) => {
            if (!videoRef.current || !canvasRef.current) {
                resolve([]);
                return;
            }
            const video = videoRef.current;
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');
            const frames: string[] = [];
            
            const objectUrl = URL.createObjectURL(videoFile);
            video.src = objectUrl;
            
            video.onloadeddata = () => {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const duration = video.duration;
                let framesExtracted = 0;
    
                const captureFrame = (time: number) => {
                    video.currentTime = time;
                };
    
                video.onseeked = () => {
                    if (framesExtracted < FRAME_COUNT && context) {
                        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
                        const dataUrl = canvas.toDataURL('image/jpeg', 0.8).split(',')[1];
                        frames.push(dataUrl);
                        framesExtracted++;
                        if (framesExtracted < FRAME_COUNT) {
                            captureFrame((duration / (FRAME_COUNT + 1)) * (framesExtracted + 1));
                        } else {
                            URL.revokeObjectURL(objectUrl);
                            video.src = '';
                            resolve(frames);
                        }
                    }
                };
    
                captureFrame(duration / (FRAME_COUNT + 1));
            };
            video.load();
        });
    }, []);

    const connectAndStart = useCallback(async () => {
        if (isActive || isConnecting) return;

        setIsConnecting(true);
        setUserSaid('');
        setBotSaid('');
        resetProfile(); // Clear profile for new session
        userSaidRef.current = '';
        botSaidRef.current = '';

        const fileToSend = file;

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;

            inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            
            const callbacks = {
                onopen: () => {
                    console.log('Live session opened.');
                    setIsConnecting(false);
                    setIsActive(true);

                    if (fileToSend) {
                         sessionPromiseRef.current?.then(session => {
                            if (fileToSend.type.startsWith('image/')) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                    const base64Data = (reader.result as string).split(',')[1];
                                    session.sendRealtimeInput({
                                        media: { data: base64Data, mimeType: fileToSend.type }
                                    });
                                     console.log('Sent image for analysis.');
                                };
                                reader.readAsDataURL(fileToSend);
                            } else if (fileToSend.type.startsWith('video/')) {
                                const streamFrames = async () => {
                                    console.log('Extracting video frames...');
                                    const frames = await extractFrames(fileToSend);
                                    console.log(`Extracted ${frames.length} frames.`);
                                    for (const frameData of frames) {
                                        session.sendRealtimeInput({
                                            media: { data: frameData, mimeType: 'image/jpeg' }
                                        });
                                        await new Promise(resolve => setTimeout(resolve, 200));
                                    }
                                    console.log('Finished sending frames.');
                                };
                                streamFrames();
                            }
                        });
                    }

                    if (streamRef.current && inputAudioContextRef.current) {
                        sourceRef.current = inputAudioContextRef.current.createMediaStreamSource(streamRef.current);
                        scriptProcessorRef.current = inputAudioContextRef.current.createScriptProcessor(4096, 1, 1);
                        scriptProcessorRef.current.onaudioprocess = (audioProcessingEvent: AudioProcessingEvent) => {
                            const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                            const pcmBlob = geminiService.createAudioBlob(inputData);
                            sessionPromiseRef.current?.then(session => session.sendRealtimeInput({ media: pcmBlob }));
                        };
                        sourceRef.current.connect(scriptProcessorRef.current);
                        scriptProcessorRef.current.connect(inputAudioContextRef.current.destination);
                    }
                },
                onmessage: async (message: LiveServerMessage) => {
                    if (message.toolCall) {
                        for (const fc of message.toolCall.functionCalls) {
                            let result = "Unknown function";
                            if (fc.name === 'saveNote' && fc.args.content) {
                                addNote(fc.args.content as string);
                                result = "Note successfully saved.";
                            } else if (fc.name === 'updateFarmProfile' && fc.args.field && fc.args.value) {
                                updateProfile(fc.args.field as keyof FarmProfile, fc.args.value as string);
                                result = `Farm profile updated: ${fc.args.field} set to ${fc.args.value}.`;
                            } else if (fc.name === 'generateFarmPlan') {
                                try {
                                    const plan = await geminiService.generateFarmPlan(profile, language);
                                    addNote(`--- Farm Plan ---\nGenerated on: ${new Date().toLocaleString()}\n\n${plan}`);
                                    result = "Your personalized farm plan has been generated and saved in your notes. You can view it in the 'Notes' tab.";
                                } catch (error) {
                                    console.error("Failed to generate farm plan via live talk:", error);
                                    result = "I'm sorry, I was unable to generate the farm plan at this time. Please try again later.";
                                }
                            }
                            sessionPromiseRef.current?.then(session => {
                                session.sendToolResponse({
                                    functionResponses: { id: fc.id, name: fc.name, response: { result } }
                                });
                            });
                        }
                    }

                    const base64EncodedAudioString = message.serverContent?.modelTurn?.parts[0]?.inlineData.data;
                    if (base64EncodedAudioString && outputAudioContextRef.current) {
                        const audioContext = outputAudioContextRef.current;
                        nextStartTimeRef.current = Math.max(nextStartTimeRef.current, audioContext.currentTime);
                        const audioBuffer = await audioUtils.decodeAudioData(audioUtils.decode(base64EncodedAudioString), audioContext, 24000, 1);
                        const source = audioContext.createBufferSource();
                        source.buffer = audioBuffer;
                        source.connect(audioContext.destination);
                        source.addEventListener('ended', () => { sourcesRef.current.delete(source); });
                        source.start(nextStartTimeRef.current);
                        nextStartTimeRef.current += audioBuffer.duration;
                        sourcesRef.current.add(source);
                    }
                    
                    if (message.serverContent?.interrupted) {
                        sourcesRef.current.forEach(source => source.stop());
                        sourcesRef.current.clear();
                        nextStartTimeRef.current = 0;
                    }

                    if (message.serverContent?.inputTranscription) {
                        userSaidRef.current += message.serverContent.inputTranscription.text;
                        setUserSaid(userSaidRef.current);
                    }
                    if (message.serverContent?.outputTranscription) {
                        botSaidRef.current += message.serverContent.outputTranscription.text;
                        setBotSaid(botSaidRef.current);
                    }
                    if (message.serverContent?.turnComplete) {
                        userSaidRef.current = '';
                        botSaidRef.current = '';
                    }
                },
                onclose: () => {
                    console.log('Live session closed.');
                    setIsActive(false);
                },
                onerror: (error: ErrorEvent) => {
                    console.error('Live session error:', error);
                    setIsActive(false);
                    setIsConnecting(false);
                },
            };
            outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            sessionPromiseRef.current = geminiService.startLiveSession(callbacks, language);

        } catch (error) {
            console.error("Failed to start live session:", error);
            alert(t('error_microphone'));
            setIsConnecting(false);
        }
    }, [isActive, isConnecting, file, addNote, updateProfile, resetProfile, profile, language, t, extractFrames]);

    const stopSession = useCallback(() => {
        sessionPromiseRef.current?.then(session => session.close());
        sessionPromiseRef.current = null;
        
        scriptProcessorRef.current?.disconnect();
        scriptProcessorRef.current = null;
        sourceRef.current?.disconnect();
        sourceRef.current = null;

        streamRef.current?.getTracks().forEach(track => track.stop());
        streamRef.current = null;

        if (inputAudioContextRef.current?.state !== 'closed') inputAudioContextRef.current?.close();
        if (outputAudioContextRef.current?.state !== 'closed') outputAudioContextRef.current?.close();
        
        setIsActive(false);
        setIsConnecting(false);
    }, []);
    
    useEffect(() => {
        return () => { stopSession(); };
    }, [stopSession]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            const url = URL.createObjectURL(selectedFile);
            setFilePreview(url);
        }
    };

    const clearFile = () => {
        if (filePreview) {
            URL.revokeObjectURL(filePreview);
        }
        setFile(null);
        setFilePreview(null);
        if(fileInputRef.current) fileInputRef.current.value = "";
    };
    
    const FarmProfileDisplay = () => (
        <div className="w-full max-w-sm bg-black/20 backdrop-blur-sm p-4 rounded-lg border border-white/10 absolute top-4 right-4 text-left text-sm">
            <h4 className="font-bold text-green-300 mb-2 text-base">{t('live_profile_title')}</h4>
            {Object.entries(profile).map(([key, value]) => value && (
                 <div key={key} className="flex justify-between border-b border-white/5 py-1">
                    <span className="font-semibold text-gray-300 capitalize">{t(key as any)}:</span>
                    <span className="text-white">{value}</span>
                </div>
            ))}
        </div>
    );

    return (
        <div className="relative flex flex-col h-full p-4 items-center justify-between text-center">
            {isActive && <FarmProfileDisplay />}
            <div className="flex-grow w-full max-w-3xl flex flex-col justify-center items-center">
                <button
                    onClick={isActive ? stopSession : connectAndStart}
                    disabled={isConnecting}
                    className={`relative flex items-center justify-center w-48 h-48 rounded-full transition-all duration-300 ease-in-out text-white
                        ${isActive ? 'bg-red-600 shadow-xl shadow-red-500/40' : 'bg-green-600 shadow-xl shadow-green-500/40'}
                        ${isConnecting ? 'bg-gray-500 cursor-not-allowed' : ''}
                    `}
                >
                    {isConnecting ? <LoaderIcon className="w-16 h-16 animate-spin" /> : <MicIcon className="w-16 h-16" />}
                    {isActive && <div className="absolute inset-0 rounded-full border-4 border-white/50 animate-pulse"></div>}
                </button>
                <p className="mt-6 text-lg text-gray-300">
                    {isConnecting ? t('connecting') : isActive ? t('listening') : file ? t('tap_to_start_analysis') : t('tap_to_start_profiling')}
                </p>
            </div>
            <div className="flex-shrink-0 w-full max-w-4xl flex flex-col items-center gap-4">
                 {filePreview ? (
                    <div className="relative w-32 h-32 mb-2 p-1 border border-gray-600 rounded-lg bg-gray-700/50">
                        {file?.type.startsWith('image/') ? (
                             <img src={filePreview} alt={t('alt_file_preview')} className="w-full h-full object-cover rounded" />
                        ) : (
                             <video src={filePreview} className="w-full h-full object-cover rounded" muted loop autoPlay playsInline />
                        )}
                        <button onClick={clearFile} disabled={isActive || isConnecting} className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-0.5 shadow-md hover:bg-red-700 transition-colors disabled:bg-gray-500">
                            <XIcon className="w-4 h-4" />
                        </button>
                    </div>
                 ) : (
                    <div className="w-32 h-32 mb-2"/>
                 )}
                <div>
                    <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" accept="image/*,video/*" disabled={isActive || isConnecting}/>
                    <button 
                        onClick={() => fileInputRef.current?.click()} 
                        disabled={isActive || isConnecting}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-600/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <PaperclipIcon className="w-5 h-5"/>
                        <span>{file ? t('change_media') : t('add_media_context')}</span>
                    </button>
                </div>
                <div className="w-full h-40 bg-gray-800/50 rounded-lg border border-white/10 p-4 overflow-y-auto mt-4">
                    <div className="h-1/2 border-b border-gray-600 p-2">
                        <span className="font-semibold text-green-400">{t('you_said')}: </span>
                        <span className="text-gray-200">{userSaid}</span>
                    </div>
                    <div className="h-1/2 p-2">
                        <span className="font-semibold text-blue-400">{t('ai_said')}: </span>
                        <span className="text-gray-200">{botSaid}</span>
                    </div>
                </div>
            </div>
            <video ref={videoRef} className="hidden" muted playsInline />
            <canvas ref={canvasRef} className="hidden" />
        </div>
    );
};
