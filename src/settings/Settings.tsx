import { createContext, useContext, useState } from 'react';

import { SourceLanguage } from '@data/DataTypes';

import useStoredParams from './useStoredParams';

export type SettingsContextType = {
  setSourceLanguage: (language: SourceLanguage) => void;
  setTargetLanguage: (language: string) => void;
  setToday: (date: Date) => void;
  sourceLanguage: SourceLanguage;
  targetLanguage: string;
  today: Date;
};

export const SettingsContext = createContext<SettingsContextType | undefined>({
  setSourceLanguage: () => {},
  setTargetLanguage: () => {},
  setToday: () => {},
  sourceLanguage: SourceLanguage.English,
  targetLanguage: 'bho',
  today: new Date(),
});

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within a SettingsProvider');
  return context;
};

export const SettingsProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { value: sourceLanguage, setValue: setSourceLanguage } = useStoredParams<SourceLanguage>(
    'sourceLanguage',
    SourceLanguage.English,
  );
  const { value: targetLanguage, setValue: setTargetLanguage } = useStoredParams(
    'targetLanguage',
    'bho',
  );
  const [today, setToday] = useState<Date>(new Date());

  const settingsContext: SettingsContextType = {
    setSourceLanguage,
    setTargetLanguage,
    setToday,
    sourceLanguage,
    targetLanguage,
    today,
  };

  return <SettingsContext.Provider value={settingsContext}>{children}</SettingsContext.Provider>;
};
