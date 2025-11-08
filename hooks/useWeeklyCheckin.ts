import React, { useEffect } from 'react';
import { ChatMessage } from '../types';
import { useLanguage } from './useLanguage';

const LAST_VISIT_KEY = 'kisan-ai-last-visit';
const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export const useWeeklyCheckin = (setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>) => {
    const { t } = useLanguage();

    useEffect(() => {
        const lastVisitString = localStorage.getItem(LAST_VISIT_KEY);
        const now = new Date().getTime();

        if (lastVisitString) {
            const lastVisitTime = parseInt(lastVisitString, 10);
            if (now - lastVisitTime > ONE_WEEK_MS) {
                const checkinMessage: ChatMessage = {
                    role: 'bot',
                    content: t('weekly_checkin'),
                };
                setMessages(prev => [checkinMessage, ...prev]);
            }
        }
        
        localStorage.setItem(LAST_VISIT_KEY, now.toString());
    }, [setMessages, t]);
};
