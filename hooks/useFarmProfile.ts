import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface FarmProfile {
    location: string;
    farmSize: string;
    soilType: string;
    waterSource: string;
    currentCrops: string;
    goals: string;
}

const initialProfile: FarmProfile = {
    location: '',
    farmSize: '',
    soilType: '',
    waterSource: '',
    currentCrops: '',
    goals: '',
};

interface FarmProfileContextType {
    profile: FarmProfile;
    updateProfile: (field: keyof FarmProfile, value: string) => void;
    resetProfile: () => void;
}

const FarmProfileContext = createContext<FarmProfileContextType | undefined>(undefined);

export const FarmProfileProvider = ({ children }: { children: ReactNode }) => {
    const [profile, setProfile] = useState<FarmProfile>(initialProfile);

    const updateProfile = useCallback((field: keyof FarmProfile, value: string) => {
        setProfile(prev => ({ ...prev, [field]: value }));
    }, []);
    
    const resetProfile = useCallback(() => {
        setProfile(initialProfile);
    }, []);

    // Fix: Replaced JSX with React.createElement to be compatible with .ts files.
    return React.createElement(
        FarmProfileContext.Provider,
        { value: { profile, updateProfile, resetProfile } },
        children
    );
};

export const useFarmProfile = (): FarmProfileContextType => {
    const context = useContext(FarmProfileContext);
    if (context === undefined) {
        throw new Error('useFarmProfile must be used within a FarmProfileProvider');
    }
    return context;
};