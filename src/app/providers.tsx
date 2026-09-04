import React from 'react';
import { ThemeProvider } from '@/app/themeContext';
import { LanguageProvider } from '@/i18n/context';
import { GamificationProvider } from '@/features/gamification/gamificationContext';

export interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <GamificationProvider>{children}</GamificationProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};
