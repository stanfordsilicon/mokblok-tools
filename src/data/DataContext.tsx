import { createContext, useContext } from 'react';

import type { UseStoredParamsReturn } from '@settings/useStoredParams';

import { type AlphabetData, type DataEntry } from './DataTypes';
import { Doc } from './Doc';
import { useSourceDataContext } from './SourceDataProvider';
import { useTargetDataContext } from './TargetDataProvider';

export type DataContextType = {
  alphabet?: AlphabetData;
  inputTSVs: Partial<Record<Doc, UseStoredParamsReturn<string>>>;
  findDataEntry(query: Partial<DataEntry>): DataEntry | undefined;
  findDataEntries(query: Partial<DataEntry>): DataEntry[];
  getTranslation(entry: DataEntry | undefined, fallback?: boolean): string;
  setTranslation(index: number, newTranslation: string): void;
  getSourceData(entry: DataEntry | undefined): string | undefined;
};

export const DataContext = createContext<DataContextType | undefined>({
  inputTSVs: {},
  alphabet: undefined,
  findDataEntry: () => undefined,
  findDataEntries: () => [],
  getTranslation: () => '',
  setTranslation: () => {},
  getSourceData: () => '',
});

export const useDataContext = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useDataContext must be used within a DataProvider');
  return context;
};

/**
 *
 * @param param0
 * @returns
 */
export const DataProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { alphabet, inputTSVs, getTranslation, setTranslation } = useTargetDataContext();
  const { findDataEntry, findDataEntries, getSourceData } = useSourceDataContext();

  const dataContext: DataContextType = {
    alphabet,
    inputTSVs,
    findDataEntry,
    findDataEntries,
    getTranslation,
    getSourceData,
    setTranslation,
  };
  return <DataContext.Provider value={dataContext}>{children}</DataContext.Provider>;
};
