import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

interface NotesContextType {
    notes: string[];
    addNote: (note: string) => void;
    clearNotes: () => void;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

const NOTES_STORAGE_KEY = 'kisan-ai-notes';

export const NotesProvider = ({ children }: { children: ReactNode }) => {
    const [notes, setNotes] = useState<string[]>([]);

    useEffect(() => {
        try {
            const storedNotes = localStorage.getItem(NOTES_STORAGE_KEY);
            if (storedNotes) {
                setNotes(JSON.parse(storedNotes));
            }
        } catch (error) {
            console.error("Failed to load notes from localStorage", error);
        }
    }, []);

    const addNote = useCallback((note: string) => {
        setNotes(prevNotes => {
            const newNotes = [note, ...prevNotes];
            try {
                localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(newNotes));
            } catch (error) {
                console.error("Failed to save notes to localStorage", error);
            }
            return newNotes;
        });
    }, []);

    const clearNotes = useCallback(() => {
        setNotes([]);
        try {
            localStorage.removeItem(NOTES_STORAGE_KEY);
        } catch (error) {
            console.error("Failed to clear notes from localStorage", error);
        }
    }, []);

    // Fix: Replaced JSX with React.createElement to be compatible with .ts files.
    return React.createElement(
        NotesContext.Provider,
        { value: { notes, addNote, clearNotes } },
        children
    );
};

export const useNotes = (): NotesContextType => {
    const context = useContext(NotesContext);
    if (context === undefined) {
        throw new Error('useNotes must be used within a NotesProvider');
    }
    return context;
};