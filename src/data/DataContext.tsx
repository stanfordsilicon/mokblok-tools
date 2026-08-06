import { createContext, useContext } from 'react';

import { type AlphabetData, type DataEntry } from './DataTypes';
import { useSourceDataContext } from './SourceDataProvider';
import { useTargetDataContext } from './TargetDataProvider';

export type DataContextType = {
  alphabet?: AlphabetData;
  findDataEntry(query: Partial<DataEntry>): DataEntry | undefined;
  findDataEntries(query: Partial<DataEntry>): DataEntry[];
  getTranslation(entry: DataEntry | undefined, fallback?: boolean): string;
  getSourceData(entry: DataEntry | undefined): string | undefined;
};

export const DataContext = createContext<DataContextType>({
  alphabet: undefined,
  findDataEntry: () => undefined,
  findDataEntries: () => [],
  getTranslation: () => '',
  getSourceData: () => '',
});

export const useDataContext = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useDataContext must be used within a DataProvider');
  return context;
};

/**
 * This provides accessors to useTargetDataContext and useSourceDataContext
 * while we are in a transition period before we fully move to the providers
 */
export const DataProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { alphabet, getTranslation } = useTargetDataContext();
  const { findDataEntry, findDataEntries, getSourceData } = useSourceDataContext();

  const dataContext: DataContextType = {
    alphabet,
    findDataEntry,
    findDataEntries,
    getTranslation,
    getSourceData,
  };
  return <DataContext.Provider value={dataContext}>{children}</DataContext.Provider>;
};
