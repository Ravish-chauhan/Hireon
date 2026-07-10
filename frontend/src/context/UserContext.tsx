import React, { createContext, useState, useContext, ReactNode } from 'react';

interface UserProfile {
  [key: string]: any;
}



interface UserContextType {
  userProfile: UserProfile | null;
  onboardingComplete: boolean;
  updateUserProfile: (data: any) => void;
  completeOnboarding: () => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [onboardingComplete, setOnboardingComplete] = useState(false);

  const updateUserProfile = (data: any) => {
    setUserProfile(prev => ({ ...prev, ...data }));
  };

  const completeOnboarding = () => {
    setOnboardingComplete(true);
  };

  const value = {
    userProfile,
    onboardingComplete,
    updateUserProfile,
    completeOnboarding,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
};
