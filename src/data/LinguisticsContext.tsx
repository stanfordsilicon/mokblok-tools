import { createContext, useContext, useEffect, useState } from 'react';

import { loadNumberingSystems, type NumberingSystem } from './NumberingSystems';

export type LinguisticsContextType = {
  numberingSystems: Record<string, NumberingSystem>;
};

export const LinguisticsContext = createContext<LinguisticsContextType | undefined>({
  numberingSystems: {},
});

export const useLinguisticsContext = () => {
  const context = useContext(LinguisticsContext);
  if (!context) throw new Error('useLinguisticsContext must be used within a DataProvider');
  return context;
};

export const LinguisticsProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [numberingSystems, setNumberingSystems] = useState<Record<string, NumberingSystem>>({});

  useEffect(() => {
    const fetchData = async () => {
      const numberingSystems = await loadNumberingSystems();
      setNumberingSystems(numberingSystems);
    };
    void fetchData();
  }, []);

  const linguisticsContext: LinguisticsContextType = {
    numberingSystems,
  };
  return (
    <LinguisticsContext.Provider value={linguisticsContext}>{children}</LinguisticsContext.Provider>
  );
};
