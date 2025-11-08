

import React, { useState, useRef, useCallback } from 'react';
import { geminiService } from '../services/geminiService';
import { MicIcon, StopCircleIcon, LoaderIcon, Trash2Icon } from './Icons';
import { useLanguage } from '../hooks/useLanguage';

type RecordingState = 'idle' | 'recording' | 'processing' | 'finished';

export const AudioTranscriber = () => {
    const [recordingState, setRecordingState] = useState<RecordingState>('idle');
    const [transcription, setTranscription] = useState<string>('');
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const { language } = useLanguage();

    const handleStartRecording = useCallback(async () => {
        setTranscription('');
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            mediaRecorderRef.current.ondataavailable = (event) => {
                audioChunksRef.current.push(event.data);
            };
            mediaRecorderRef.current.onstop = async () => {
                setRecordingState('processing');
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                audioChunksRef.current = [];
                 try {
                    // Fix: Pass the current language to the transcribeAudio service call.
                    const text = await geminiService.transcribeAudio(audioBlob, language);
                    setTranscription(text);
                } catch (error) {
                    console.error("Transcription failed:", error);
                    setTranscription("Sorry, transcription failed. Please try again.");
                } finally {
                    setRecordingState('finished');
                }
            };
            audioChunksRef.current = [];
            mediaRecorderRef.current.start();
            setRecordingState('recording');
        } catch (error) {
            console.error("Could not get microphone access:", error);
            alert("Microphone access is required to record audio.");
        }
    }, [language]);

    const handleStopRecording = useCallback(() => {
        if (mediaRecorderRef.current && recordingState === 'recording') {
            mediaRecorderRef.current.stop();
        }
    }, [recordingState]);
    
    const reset = () => {
        setRecordingState('idle');
        setTranscription('');
    };

    return (
        <div className="flex flex-col h-full p-4 items-center justify-center text-center">
            <h2 className="text-xl font-bold text-green-300 mb-4">Audio Transcription</h2>
            <p className="text-gray-400 mb-8 max-w-md">Record your voice notes, observations, or questions in your local language. Kisan AI will transcribe them into text for your records.</p>
            
            <div className="mb-8">
                {recordingState === 'idle' && (
                    <button onClick={handleStartRecording} className="p-6 rounded-full bg-green-600 hover:bg-green-700 transition-all duration-300 text-white shadow-lg shadow-green-500/30">
                        <MicIcon className="w-10 h-10" />
                    </button>
                )}
                {recordingState === 'recording' && (
                     <button onClick={handleStopRecording} className="p-6 rounded-full bg-red-600 hover:bg-red-700 transition-all duration-300 text-white animate-pulse shadow-lg shadow-red-500/30">
                        <StopCircleIcon className="w-10 h-10" />
                    </button>
                )}
                 {(recordingState === 'processing' || recordingState === 'finished') && (
                     <button onClick={reset} disabled={recordingState === 'processing'} className="p-6 rounded-full bg-gray-600 hover:bg-gray-700 transition-all duration-300 text-white disabled:cursor-not-allowed">
                        <Trash2Icon className="w-10 h-10" />
                    </button>
                )}
            </div>

            <div className="w-full max-w-2xl min-h-[200px] bg-gray-800/50 rounded-lg border border-white/10 p-4 overflow-y-auto">
                <h3 className="font-semibold text-lg mb-2 text-green-400">Transcription Result</h3>
                {recordingState === 'processing' && (
                     <div className="flex items-center justify-center h-full text-gray-400">
                        <LoaderIcon className="animate-spin w-8 h-8"/>
                    </div>
                )}
                {transcription && <p className="text-gray-200 whitespace-pre-wrap">{transcription}</p>}
                {!transcription && recordingState !== 'processing' && <p className="text-gray-400">Your transcription will appear here.</p>}
            </div>
        </div>
    );
};