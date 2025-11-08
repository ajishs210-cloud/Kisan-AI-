import React, { useState, useCallback } from 'react';
import { geminiService } from '../services/geminiService';
import { useLanguage } from '../hooks/useLanguage';
// Fix: Removed unused UploadCloudIcon import to resolve module export error.
import { LoaderIcon, SparklesIcon, FileImageIcon } from './Icons';

export const ImageAnalyzer = () => {
    const { t, language } = useLanguage();
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string>('');
    const [prompt, setPrompt] = useState<string>(t('image_analyzer_default_prompt'));
    const [result, setResult] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    
    // Update prompt when language changes
    React.useEffect(() => {
        setPrompt(t('image_analyzer_default_prompt'));
    }, [t]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
            setResult('');
        }
    };

    const handleAnalyze = useCallback(async () => {
        if (!image || !prompt) return;
        setIsLoading(true);
        setResult('');
        try {
            const analysis = await geminiService.analyzeImage(image, prompt, language);
            setResult(analysis);
        } catch (error) {
            console.error("Image analysis failed:", error);
            setResult(t('error_image_analysis'));
        } finally {
            setIsLoading(false);
        }
    }, [image, prompt, language, t]);

    return (
        <div className="flex flex-col h-full p-4 overflow-y-auto">
            <h2 className="text-xl font-bold text-green-300 mb-4 text-center">{t('image_analyzer_title')}</h2>
            <div className="flex flex-col md:flex-row gap-4 flex-grow">
                {/* Left Panel */}
                <div className="w-full md:w-1/2 flex flex-col gap-4">
                    <div className="relative w-full h-64 border-2 border-dashed border-gray-500 rounded-lg flex items-center justify-center text-gray-400 bg-white/5">
                        {preview ? (
                            <img src={preview} alt={t('alt_upload_preview')} className="object-contain h-full w-full rounded-lg" />
                        ) : (
                            <div className="text-center">
                                <FileImageIcon className="w-12 h-12 mx-auto mb-2"/>
                                <p>{t('image_analyzer_upload_instruction')}</p>
                            </div>
                        )}
                         <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                    </div>
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder={t('image_analyzer_prompt_placeholder')}
                        className="w-full p-3 bg-gray-800/50 rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all resize-none"
                        rows={4}
                    />
                    <button
                        onClick={handleAnalyze}
                        disabled={!image || isLoading}
                        className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 disabled:bg-gray-600 transition-colors"
                    >
                        {isLoading ? <LoaderIcon className="animate-spin w-5 h-5"/> : <SparklesIcon className="w-5 h-5"/>}
                        <span>{isLoading ? t('analyzing') : t('analyze_image_button')}</span>
                    </button>
                </div>
                
                {/* Right Panel */}
                <div className="w-full md:w-1/2 flex flex-col">
                    <div className="flex-grow p-4 bg-gray-800/50 rounded-lg border border-white/10 overflow-y-auto">
                        <h3 className="font-semibold text-lg mb-2 text-green-400">{t('analysis_result_title')}</h3>
                        {isLoading && (
                            <div className="flex items-center justify-center h-full text-gray-400">
                                <LoaderIcon className="animate-spin w-8 h-8"/>
                            </div>
                        )}
                        {result && <p className="text-gray-200 whitespace-pre-wrap">{result}</p>}
                        {!result && !isLoading && <p className="text-gray-400">{t('results_placeholder')}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};