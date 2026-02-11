import { createContext, useContext } from 'react';

import { SourceLanguage } from '@data/DataTypes';

import useStoredParams from './useStoredParams';

export type SettingsContextType = {
  setSourceLanguage: (language: SourceLanguage) => void;
  setTargetLanguage: (language: string) => void;
  sourceLanguage: SourceLanguage;
  targetLanguage: string;
};

export const SettingsContext = createContext<SettingsContextType | undefined>({
  setSourceLanguage: () => {},
  setTargetLanguage: () => {},
  sourceLanguage: SourceLanguage.English,
  targetLanguage: 'bho',
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

  const settingsContext: SettingsContextType = {
    targetLanguage,
    sourceLanguage,
    setSourceLanguage,
    setTargetLanguage,
  };

  return <SettingsContext.Provider value={settingsContext}>{children}</SettingsContext.Provider>;
};
