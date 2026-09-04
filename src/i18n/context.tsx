import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { Language, LanguageContextValue, TranslationSchema } from '@/types/i18n';
import { storage } from '@/utils/storage';
import { en } from './en';
import { bn } from './bn';

const STORAGE_KEY = 'gitverse_language';

const translations: Record<Language, TranslationSchema> = {
  en,
  bn,
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = storage.get<Language>(STORAGE_KEY, 'en');
    return saved === 'bn' || saved === 'en' ? saved : 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    storage.set(STORAGE_KEY, lang);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'bn' : 'en');
  };

  useEffect(() => {
    document.documentElement.setAttribute('lang', language);
    if (language === 'bn') {
      document.documentElement.classList.add('font-bn');
    } else {
      document.documentElement.classList.remove('font-bn');
    }
  }, [language]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage,
      toggleLanguage,
      t: translations[language] || translations.en,
    }),
    [language]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = (): LanguageContextValue => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const useTranslation = () => {
  const { t, language } = useLanguage();
  return { t, language };
};
