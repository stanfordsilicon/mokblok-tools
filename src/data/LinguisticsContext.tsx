import { createContext, useContext, useEffect, useState } from 'react';

import { LanguageNameData, loadLanguageNames } from './LanguageNames';
import { loadNumberingSystems, type NumberingSystem } from './NumberingSystems';

export type LinguisticsContextType = {
  numberingSystems: Record<string, NumberingSystem>;
  languageNames: Record<string, LanguageNameData>;
};

export const LinguisticsContext = createContext<LinguisticsContextType | undefined>(undefined);

export const useLinguisticsContext = () => {
  const context = useContext(LinguisticsContext);
  if (!context) throw new Error('useLinguisticsContext must be used within a DataProvider');
  return context;
};

export const LinguisticsProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [numberingSystems, setNumberingSystems] = useState<Record<string, NumberingSystem>>({});
  const [languageNames, setLanguageNames] = useState<Record<string, LanguageNameData>>({});

  useEffect(() => {
    const fetchData = async () => {
      const numberingSystems = await loadNumberingSystems();
      setNumberingSystems(numberingSystems);
      const languageNames = await loadLanguageNames();
      setLanguageNames(languageNames);
    };
    void fetchData();
  }, []);

  const linguisticsContext: LinguisticsContextType = {
    numberingSystems,
    languageNames,
  };
  return (
    <LinguisticsContext.Provider value={linguisticsContext}>{children}</LinguisticsContext.Provider>
  );
};
