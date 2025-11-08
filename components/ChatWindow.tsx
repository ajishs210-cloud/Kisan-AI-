import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChatMessage } from '../types';
import { geminiService } from '../services/geminiService';
import { useGeolocation } from '../hooks/useGeolocation';
import { useLanguage } from '../hooks/useLanguage';
import { useWeeklyCheckin } from '../hooks/useWeeklyCheckin';
import { SendIcon, BotIcon, UserIcon, LoaderIcon, Volume2Icon, BrainCircuitIcon, MicIcon, PaperclipIcon, XIcon } from './Icons';

export const ChatWindow = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [thinkingMode, setThinkingMode] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [filePreview, setFilePreview] = useState<string | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    
    const { coordinates, getLocation } = useGeolocation();
    const { t, language } = useLanguage();
    useWeeklyCheckin(setMessages);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        getLocation();
    }, [getLocation]);

    const handleSend = useCallback(async (prompt: string, attachedFile: File | null = null, attachedFilePreview: string | null = null) => {
        if (!prompt.trim() || isLoading) return;

        const newUserMessage: ChatMessage = { role: 'user', content: prompt };
        if (attachedFile && attachedFilePreview) {
            newUserMessage.imageUrl = attachedFilePreview;
        }
        
        setMessages(prev => [...prev, newUserMessage]);
        setInput('');
        setFile(null);
        setFilePreview(null);
        setIsLoading(true);

        try {
            const botResponse = await geminiService.generateText({
                prompt,
                file: attachedFile,
                thinkingMode,
                coordinates,
                language
            });
            const newBotMessage: ChatMessage = { role: 'bot', content: botResponse };
            setMessages(prev => [...prev, newBotMessage]);
        } catch (error) {
            console.error("Failed to get response:", error);
            const errorMessage: ChatMessage = { role: 'bot', content: t('error_generic') };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    }, [isLoading, thinkingMode, coordinates, language, t]);
    
    const playSpeech = async (text: string) => {
        try {
            await geminiService.generateAndPlaySpeech(text, language);
        } catch (error) {
            console.error("TTS Error:", error);
            alert(t('error_tts'));
        }
    };
    
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            const reader = new FileReader();
            reader.onloadend = () => {
                setFilePreview(reader.result as string);
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const clearFile = () => {
        setFile(null);
        setFilePreview(null);
        if(fileInputRef.current) fileInputRef.current.value = "";
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            setIsRecording(true);
            mediaRecorderRef.current = new MediaRecorder(stream);
            mediaRecorderRef.current.ondataavailable = (event) => audioChunksRef.current.push(event.data);
            mediaRecorderRef.current.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                audioChunksRef.current = [];
                try {
                    setIsLoading(true);
                    const text = await geminiService.transcribeAudio(audioBlob, language);
                    if (text.trim()) {
                        handleSend(text, file, filePreview); // Send transcription with any attached file
                    }
                } catch (error) {
                    console.error("Transcription failed:", error);
                } finally {
                    setIsLoading(false);
                }
            };
            audioChunksRef.current = [];
            mediaRecorderRef.current.start();
        } catch (error) {
            console.error("Could not get microphone access:", error);
            alert(t('error_microphone'));
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const ToggleButton = ({ isEnabled, onToggle, icon, label }: { isEnabled: boolean; onToggle: () => void; icon: React.ReactNode; label: string }) => (
        <button
            onClick={onToggle}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs transition-all duration-300 ${isEnabled ? 'bg-green-500/80 text-white' : 'bg-gray-500/50 hover:bg-gray-500/80 text-gray-200'}`}
            title={label}
        >
            {icon}
            <span>{label}</span>
        </button>
    );

    return (
        <div className="flex flex-col h-full p-4">
            <div className="flex-grow overflow-y-auto pr-4 -mr-4 space-y-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                       {msg.role === 'bot' && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center"><BotIcon className="w-5 h-5 text-green-400"/></div>}
                        <div className={`max-w-lg p-3 rounded-2xl ${msg.role === 'user' ? 'bg-blue-600/50 rounded-br-none' : 'bg-gray-700/50 rounded-bl-none'}`}>
                            {msg.imageUrl && (
                                <img src={msg.imageUrl} alt={t('alt_user_upload')} className="max-w-xs max-h-48 rounded-lg mb-2" />
                            )}
                            <p className="text-white whitespace-pre-wrap">{msg.content}</p>
                            {msg.role === 'bot' && (
                                <button onClick={() => playSpeech(msg.content)} className="mt-2 text-gray-400 hover:text-white transition-colors">
                                    <Volume2Icon className="w-4 h-4"/>
                                </button>
                            )}
                        </div>
                         {msg.role === 'user' && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center"><UserIcon className="w-5 h-5 text-blue-300"/></div>}
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center"><BotIcon className="w-5 h-5 text-green-400"/></div>
                        <div className="max-w-lg p-3 rounded-2xl bg-gray-700/50 rounded-bl-none flex items-center gap-2">
                           <LoaderIcon className="w-5 h-5 animate-spin"/>
                           <span className="text-gray-300">{t('thinking')}...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <div className="flex-shrink-0 mt-4">
                <div className="flex items-center justify-center gap-2 sm:gap-4 mb-2 flex-wrap">
                    <ToggleButton isEnabled={thinkingMode} onToggle={() => setThinkingMode(!thinkingMode)} icon={<BrainCircuitIcon className="w-4 h-4"/>} label={t('deep_thought')}/>
                </div>
                 {filePreview && (
                    <div className="relative inline-block w-24 h-24 mb-2 p-1 border border-gray-600 rounded-lg bg-gray-700/50">
                        <img src={filePreview} alt={t('alt_file_preview')} className="w-full h-full object-cover rounded" />
                        <button onClick={clearFile} className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-0.5 shadow-md hover:bg-red-700 transition-colors">
                            <XIcon className="w-4 h-4" />
                        </button>
                    </div>
                )}
                <div className="flex items-center gap-2 p-2 bg-gray-800/50 rounded-xl border border-white/10">
                    <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" accept="image/*"/>
                    <button onClick={() => fileInputRef.current?.click()} className="p-2 text-gray-400 hover:text-white transition-colors" title={t('attach_image')}>
                        <PaperclipIcon className="w-5 h-5"/>
                    </button>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(input, file, filePreview); } }}
                        placeholder={t('chat_placeholder')}
                        className="flex-grow bg-transparent text-white placeholder-gray-400 focus:outline-none resize-none p-2"
                        rows={1}
                        disabled={isRecording}
                    />
                    <button onClick={isRecording ? stopRecording : startRecording} disabled={isLoading} className={`p-2 rounded-lg ${isRecording ? 'bg-red-600 animate-pulse' : 'bg-green-600'} hover:opacity-80 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors`}>
                        <MicIcon className="w-5 h-5 text-white" />
                    </button>
                    <button onClick={() => handleSend(input, file, filePreview)} disabled={isLoading || (!input.trim() && !file)} className="p-2 rounded-lg bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors">
                        <SendIcon className="w-5 h-5 text-white" />
                    </button>
                </div>
            </div>
        </div>
    );
};