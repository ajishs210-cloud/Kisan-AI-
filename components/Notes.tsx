import React from 'react';
import { useNotes } from '../hooks/useNotes';
import { useLanguage } from '../hooks/useLanguage';
import { Trash2Icon, NotesIcon } from './Icons';

export const Notes = () => {
    const { notes, clearNotes } = useNotes();
    const { t } = useLanguage();

    return (
        <div className="flex flex-col h-full p-4 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-green-300 flex items-center gap-2">
                    <NotesIcon className="w-6 h-6" />
                    {t('notes_title')}
                </h2>
                {notes.length > 0 && (
                    <button 
                        onClick={clearNotes}
                        className="flex items-center gap-2 px-3 py-1.5 bg-red-600/20 text-red-300 rounded-lg hover:bg-red-600/40 transition-colors text-sm"
                    >
                        <Trash2Icon className="w-4 h-4"/>
                        {t('clear_all_button')}
                    </button>
                )}
            </div>
            <div className="flex-grow space-y-3">
                {notes.length > 0 ? (
                    notes.map((note, index) => (
                        <div key={index} className="bg-gray-800/50 p-4 rounded-lg border border-white/10 shadow-md">
                            <p className="text-white whitespace-pre-wrap">{note}</p>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500 text-center">
                        <NotesIcon className="w-16 h-16 mb-4"/>
                        <h3 className="text-lg font-semibold">{t('no_notes_title')}</h3>
                        <p>{t('no_notes_subtitle')}</p>
                    </div>
                )}
            </div>
        </div>
    );
};