
import React, { useState, useRef, useEffect } from 'react';
import { ChatWindow } from './components/ChatWindow';
import { LiveTalk } from './components/LiveTalk';
import { Notes } from './components/Notes';
import { NotesIcon, GlobeIcon, FarmingLogoIcon } from './components/Icons';
import { useLanguage } from './hooks/useLanguage';
import { Language } from './utils/translations';

type Tab = 'Chat' | 'Live' | 'Notes';

const App = () => {
    const [activeTab, setActiveTab] = useState<Tab>('Chat');
    const [sliderStyle, setSliderStyle] = useState({});
    const [langDropdownOpen, setLangDropdownOpen] = useState(false);
    const navRef = useRef<HTMLElement>(null);
    const langDropdownRef = useRef<HTMLDivElement>(null);
    const { t, setLanguage, language } = useLanguage();

    const languages: { code: Language; name: string }[] = [
        { code: 'en', name: 'English' },
        { code: 'hi', name: 'हिन्दी' },
        { code: 'pa', name: 'ਪੰਜਾਬੀ' },
        { code: 'ta', name: 'தமிழ்' },
    ];

    useEffect(() => {
        if (navRef.current) {
            const activeButton = navRef.current.querySelector(`[data-tab="${activeTab}"]`) as HTMLElement;
            if (activeButton) {
                setSliderStyle({
                    left: `${activeButton.offsetLeft}px`,
                    width: `${activeButton.offsetWidth}px`,
                });
            }
        }
    }, [activeTab]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
                setLangDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLanguageChange = (langCode: Language) => {
        setLanguage(langCode);
        setLangDropdownOpen(false);
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'Chat': return <ChatWindow />;
            case 'Live': return <LiveTalk />;
            case 'Notes': return <Notes />;
            default: return <ChatWindow />;
        }
    };

    const TabButton = ({ tab, label, icon }: { tab: Tab, label: string, icon?: React.ReactNode }) => (
        <button
            onClick={() => setActiveTab(tab)}
            data-tab={tab}
            className={`px-4 py-2 text-sm font-medium transition-colors relative z-10 flex items-center gap-2 rounded-full whitespace-nowrap ${
                activeTab === tab 
                ? 'text-white' 
                : 'text-gray-300 hover:text-white'
            }`}
        >
            {icon}
            {label}
        </button>
    );

    return (
        <div className="bg-gray-900/60 backdrop-blur-2xl text-white h-screen flex flex-col font-sans">
            <header className="flex-shrink-0 bg-transparent border-b border-white/10 flex justify-between items-center p-4 z-20">
                <div className="flex items-center gap-3">
                    <FarmingLogoIcon className="w-8 h-8 text-green-400" />
                    <h1 className="text-2xl font-bold text-green-400">
                        {t('app_title')}
                    </h1>
                </div>
                <div className="relative" ref={langDropdownRef}>
                    <button
                        onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                        className="flex items-center gap-2 px-3 py-2 rounded-md bg-white/10 hover:bg-white/20 transition-colors text-gray-200"
                    >
                        <GlobeIcon className="w-5 h-5" />
                        <span className="uppercase text-xs font-semibold">{language}</span>
                    </button>
                    {langDropdownOpen && (
                        <div className="absolute top-full right-0 mt-2 w-36 bg-gray-800 border border-white/10 rounded-lg shadow-xl overflow-hidden animate-fade-in-down">
                            {languages.map(lang => (
                                <button
                                    key={lang.code}
                                    onClick={() => handleLanguageChange(lang.code)}
                                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                                        language === lang.code ? 'bg-green-500/20 text-green-300' : 'text-gray-200 hover:bg-white/5'
                                    }`}
                                >
                                    {lang.name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </header>
            <div className="flex-shrink-0 px-4 flex justify-start sm:justify-center overflow-x-auto no-scrollbar">
                <nav ref={navRef} className="relative flex flex-nowrap bg-black/20 p-1 rounded-full my-2">
                    <TabButton tab="Chat" label={t('tab_chat')} />
                    <TabButton tab="Live" label={t('tab_live')} />
                    <TabButton tab="Notes" label={t('tab_notes')} icon={<NotesIcon className="w-5 h-5" />} />
                    <div 
                        className="absolute top-1 bottom-1 bg-green-600/40 rounded-full transition-all duration-300 ease-in-out"
                        style={sliderStyle}
                    />
                </nav>
            </div>
            <main className="flex-grow overflow-hidden">
                {renderContent()}
            </main>
             <style>{`
                @keyframes fade-in-down {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-down {
                    animation: fade-in-down 0.2s ease-out forwards;
                }
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
};

export default App;