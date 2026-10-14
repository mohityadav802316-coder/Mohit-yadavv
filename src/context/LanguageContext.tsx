import React, { createContext, useContext, useState, useEffect } from 'react';
import { LanguageMode } from '../types';

interface LanguageContextType {
  mode: LanguageMode;
  setMode: (mode: LanguageMode) => void;
  renderText: (en: string, hi: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  mode: 'both',
  setMode: () => {},
  renderText: (en) => en,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<LanguageMode>(() => {
    const saved = localStorage.getItem('mohit_portfolio_lang');
    if (saved === 'en' || saved === 'hi' || saved === 'both') {
      return saved as LanguageMode;
    }
    return 'both';
  });

  const setMode = (newMode: LanguageMode) => {
    setModeState(newMode);
    localStorage.setItem('mohit_portfolio_lang', newMode);
  };

  const renderText = (en: string, hi: string): string => {
    if (mode === 'en') return en;
    if (mode === 'hi') return hi;
    return `${en} / ${hi}`;
  };

  return (
    <LanguageContext.Provider value={{ mode, setMode, renderText }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
