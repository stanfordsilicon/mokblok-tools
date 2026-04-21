import { createContext, useContext, useMemo, useState } from 'react';

import { CoverageLevel } from '@data/CoverageLevel';
import { SourceLanguage } from '@data/DataTypes';

import useStoredParams from './useStoredParams';

export type SettingsContextType = {
  setCoverageLevel: (level: CoverageLevel) => void;
  setSourceLanguage: (language: SourceLanguage) => void;
  setTargetLanguage: (language: string) => void;
  setToday: (date: Date) => void;
  coverageLevel: CoverageLevel;
  sourceLanguage: SourceLanguage;
  targetLanguage: string;
  targetLanguageBCP: string; // 2-letter language code when appropriate
  today: Date;
};

export const SettingsContext = createContext<SettingsContextType | undefined>({
  setCoverageLevel: () => {},
  setSourceLanguage: () => {},
  setTargetLanguage: () => {},
  setToday: () => {},
  coverageLevel: CoverageLevel.Moderate,
  sourceLanguage: SourceLanguage.English,
  targetLanguage: 'bho',
  targetLanguageBCP: 'bho', // 2-letter language codes when appropriate
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
  const { value: coverageLevel, setValue: setCoverageLevel } = useStoredParams<CoverageLevel>(
    'coverageLevel',
    CoverageLevel.Moderate,
  );
  const [today, setToday] = useState<Date>(new Date());
  const targetLanguageBCP = useMemo(() => {
    // Convert to 2-letter code if possible
    // TODO get these from a more comprehensive source
    if (targetLanguage === 'eng') return 'en';
    if (targetLanguage === 'fra') return 'fr';
    if (targetLanguage === 'mlg') return 'mg';
    if (targetLanguage === 'tsn') return 'tn';
    if (targetLanguage === 'tgk') return 'tg';
    if (targetLanguage === 'tso') return 'ts';
    if (targetLanguage === 'ven') return 've';
    if (targetLanguage === 'wol') return 'wo';
    if (targetLanguage === 'ful') return 'ff';
    if (targetLanguage === 'sna') return 'sn';
    if (targetLanguage === 'nde') return 'nd';
    if (targetLanguage === 'kin') return 'rw';
    if (targetLanguage === 'aar') return 'aa';
    if (targetLanguage === 'hau') return 'ha';
    if (targetLanguage === 'ltz') return 'lb';
    if (targetLanguage === 'fao') return 'fo';
    if (targetLanguage === 'mon') return 'mn';
    if (targetLanguage === 'sag') return 'sg';
    if (targetLanguage === 'ssw') return 'ss';
    if (targetLanguage === 'bos') return 'bs';
    if (targetLanguage === 'aka') return 'ak';
    if (targetLanguage === 'uzb') return 'uz';
    if (targetLanguage === 'mlt') return 'mt';
    if (targetLanguage === 'aze') return 'az';
    return targetLanguage;
  }, [targetLanguage]);

  const settingsContext: SettingsContextType = {
    setCoverageLevel,
    setSourceLanguage,
    setTargetLanguage,
    setToday,
    coverageLevel,
    sourceLanguage,
    targetLanguage,
    targetLanguageBCP,
    today,
  };

  return <SettingsContext.Provider value={settingsContext}>{children}</SettingsContext.Provider>;
};
