import { createContext, useContext, useState } from 'react';

import { CoverageLevel } from '@data/CoverageLevel';

import useStoredParams from './useStoredParams';

export type SettingsContextType = {
  setCoverageLevel: (level: CoverageLevel) => void;
  setToday: (date: Date) => void;
  coverageLevel: CoverageLevel;
  today: Date;
};

export const SettingsContext = createContext<SettingsContextType | undefined>({
  setCoverageLevel: () => {},
  setToday: () => {},
  coverageLevel: CoverageLevel.Moderate,
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
  const { value: coverageLevel, setValue: setCoverageLevel } = useStoredParams<CoverageLevel>(
    'coverageLevel',
    CoverageLevel.Moderate,
  );
  const [today, setToday] = useState<Date>(new Date());

  const settingsContext: SettingsContextType = {
    setCoverageLevel,
    setToday,
    coverageLevel,
    today,
  };

  return <SettingsContext.Provider value={settingsContext}>{children}</SettingsContext.Provider>;
};
