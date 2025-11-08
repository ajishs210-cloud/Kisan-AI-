import React, { useState, useRef, useCallback } from 'react';
import { geminiService } from '../services/geminiService';
import { useLanguage } from '../hooks/useLanguage';
import { LoaderIcon, SparklesIcon, FilmIcon } from './Icons';

const FRAME_COUNT = 5;

export const VideoAnalyzer = () => {
    const { t, language } = useLanguage();
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [videoUrl, setVideoUrl] = useState<string>('');
    const [prompt, setPrompt] = useState<string>(t('video_analyzer_default_prompt'));
    const [result, setResult] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [status, setStatus] = useState<string>('');
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Update prompt when language changes
    React.useEffect(() => {
        setPrompt(t('video_analyzer_default_prompt'));
    }, [t]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setVideoFile(file);
            const url = URL.createObjectURL(file);
            setVideoUrl(url);
            setResult('');
        }
    };

    const extractFrames = useCallback(async (): Promise<string[]> => {
        return new Promise((resolve) => {
            if (!videoRef.current || !canvasRef.current) {
                resolve([]);
                return;
            }
            const video = videoRef.current;
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');
            const frames: string[] = [];
            
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
                            resolve(frames);
                        }
                    }
                };

                captureFrame(duration / (FRAME_COUNT + 1));
            };
        });
    }, []);

    const handleAnalyze = useCallback(async () => {
        if (!videoFile || !prompt) return;

        setIsLoading(true);
        setResult('');
        setStatus(t('preparing_video'));

        const frames = await extractFrames();
        if (frames.length > 0) {
            setStatus(t('analyzing_frames', { count: frames.length }));
            try {
                const analysis = await geminiService.analyzeVideoFrames(frames, prompt, language);
                setResult(analysis);
            } catch (error) {
                console.error("Video analysis failed:", error);
                setResult(t('error_video_analysis'));
            }
        } else {
            setResult(t('error_frame_extraction'));
        }
        
        setIsLoading(false);
        setStatus('');
    }, [videoFile, prompt, extractFrames, language, t]);

    return (
        <div className="flex flex-col h-full p-4 overflow-y-auto">
            <h2 className="text-xl font-bold text-green-300 mb-4 text-center">{t('video_analyzer_title')}</h2>
            <div className="flex flex-col md:flex-row gap-4 flex-grow">
                {/* Left Panel */}
                <div className="w-full md:w-1/2 flex flex-col gap-4">
                    <div className="relative w-full aspect-video border-2 border-dashed border-gray-500 rounded-lg flex items-center justify-center text-gray-400 bg-white/5">
                        {videoUrl ? (
                            <video ref={videoRef} src={videoUrl} controls className="object-contain h-full w-full rounded-lg" />
                        ) : (
                            <div className="text-center">
                                <FilmIcon className="w-12 h-12 mx-auto mb-2"/>
                                <p>{t('video_analyzer_upload_instruction')}</p>
                            </div>
                        )}
                        <input
                            type="file"
                            accept="video/*"
                            onChange={handleFileChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                    </div>
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder={t('video_analyzer_prompt_placeholder')}
                        className="w-full p-3 bg-gray-800/50 rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all resize-none"
                        rows={4}
                    />
                    <button
                        onClick={handleAnalyze}
                        disabled={!videoFile || isLoading}
                        className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 disabled:bg-gray-600 transition-colors"
                    >
                        {isLoading ? <LoaderIcon className="animate-spin w-5 h-5"/> : <SparklesIcon className="w-5 h-5"/>}
                        <span>{isLoading ? t('analyzing') : t('analyze_video_button')}</span>
                    </button>
                    {isLoading && <p className="text-sm text-center text-green-300">{status}</p>}
                </div>
                
                {/* Right Panel */}
                <div className="w-full md:w-1/2 flex flex-col">
                    <div className="flex-grow p-4 bg-gray-800/50 rounded-lg border border-white/10 overflow-y-auto">
                        <h3 className="font-semibold text-lg mb-2 text-green-400">{t('analysis_result_title')}</h3>
                        {isLoading && !result &&(
                            <div className="flex items-center justify-center h-full text-gray-400">
                                <LoaderIcon className="animate-spin w-8 h-8"/>
                            </div>
                        )}
                        {result && <p className="text-gray-200 whitespace-pre-wrap">{result}</p>}
                        {!result && !isLoading && <p className="text-gray-400">{t('results_placeholder')}</p>}
                    </div>
                </div>
            </div>
            <canvas ref={canvasRef} className="hidden"></canvas>
        </div>
    );
};