import React, { useState } from 'react';
import { useFarmProfile, FarmProfile } from '../hooks/useFarmProfile';
import { geminiService } from '../services/geminiService';
import { useLanguage } from '../hooks/useLanguage';
import { LoaderIcon, SparklesIcon } from './Icons';

export const FarmPlanner = () => {
    const { profile, updateProfile } = useFarmProfile();
    const [plan, setPlan] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { t, language } = useLanguage();

    const handleGeneratePlan = async () => {
        setIsLoading(true);
        setPlan('');
        try {
            const result = await geminiService.generateFarmPlan(profile, language);
            setPlan(result);
        } catch (error) {
            console.error("Failed to generate farm plan:", error);
            setPlan(t('error_plan_generation'));
        } finally {
            setIsLoading(false);
        }
    };

    const renderInputField = (id: keyof FarmProfile, labelKey: string, placeholderKey: string, type: string = "text") => (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-green-300 mb-1">{t(labelKey as any)}</label>
            <input
                type={type}
                id={id}
                value={profile[id]}
                onChange={(e) => updateProfile(id, e.target.value)}
                placeholder={t(placeholderKey as any)}
                className="w-full p-2 bg-gray-800/50 rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
            />
        </div>
    );

    return (
        <div className="flex flex-col h-full p-4 overflow-y-auto">
            <h2 className="text-xl font-bold text-green-300 mb-4 text-center">{t('planner_title')}</h2>
            <div className="flex flex-col md:flex-row gap-4 flex-grow">
                {/* Left Panel: Profile */}
                <div className="w-full md:w-1/2 flex flex-col gap-4">
                    <h3 className="font-semibold text-lg text-green-400">{t('farm_profile_title')}</h3>
                    {renderInputField("location", "location", "location_placeholder")}
                    {renderInputField("farmSize", "farmSize", "farmSize_placeholder", "number")}
                    {renderInputField("soilType", "soilType", "soilType_placeholder")}
                    {renderInputField("waterSource", "waterSource", "waterSource_placeholder")}
                    {renderInputField("currentCrops", "currentCrops", "currentCrops_placeholder")}
                    <div>
                        <label htmlFor="goals" className="block text-sm font-medium text-green-300 mb-1">{t('goals')}</label>
                        <textarea
                            id="goals"
                            value={profile.goals}
                            onChange={(e) => updateProfile("goals", e.target.value)}
                            placeholder={t('goals_placeholder')}
                            className="w-full p-2 bg-gray-800/50 rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all resize-none"
                            rows={4}
                        />
                    </div>
                    <button
                        onClick={handleGeneratePlan}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 disabled:bg-gray-600 transition-colors"
                    >
                        {isLoading ? <LoaderIcon className="animate-spin w-5 h-5" /> : <SparklesIcon className="w-5 h-5" />}
                        <span>{isLoading ? t('generating') : t('generate_plan_button')}</span>
                    </button>
                </div>

                {/* Right Panel: Plan */}
                <div className="w-full md:w-1/2 flex flex-col">
                    <div className="flex-grow p-4 bg-gray-800/50 rounded-lg border border-white/10 overflow-y-auto">
                        <h3 className="font-semibold text-lg mb-2 text-green-400">{t('generated_plan_title')}</h3>
                        {isLoading && (
                            <div className="flex items-center justify-center h-full text-gray-400">
                                <LoaderIcon className="animate-spin w-8 h-8" />
                            </div>
                        )}
                        {plan && <div className="text-gray-200 whitespace-pre-wrap prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: plan.replace(/\n/g, '<br />') }} />}
                        {!plan && !isLoading && <p className="text-gray-400">{t('plan_placeholder')}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};