import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { useURLParams } from '@settings/URLParams';

import { SourceLanguage, type DataEntry } from '../DataTypes';
import { loadCLDRXMLWithInheritance } from '../loadCLDRXML';
import { loadDataEntries } from '../LoadDataEntries';

export type FindDataEntry = (query: Partial<DataEntry>) => DataEntry | undefined;
export type FindDataEntries = (query: Partial<DataEntry>) => DataEntry[];
export enum SourceDataStatus {
  Initial,
  LoadingDataEntries,
  LoadingSourceData,
  Ready,
  Error,
}

export type SourceDataContextType = {
  dataEntries: DataEntry[];
  findDataEntry(query: Partial<DataEntry>): DataEntry | undefined;
  findDataEntries(query: Partial<DataEntry>): DataEntry[];
  getSourceData(entry: DataEntry | undefined): string | undefined;
  sourceDataStatus: SourceDataStatus;
};

export const SourceDataContext = createContext<SourceDataContextType>({
  dataEntries: [],
  findDataEntry: () => undefined,
  findDataEntries: () => [],
  getSourceData: () => '',
  sourceDataStatus: SourceDataStatus.Initial,
});

export const useSourceDataContext = () => {
  const context = useContext(SourceDataContext);
  if (!context) throw new Error('useSourceDataContext must be used within a SourceDataProvider');
  return context;
};

/**
 * This component is responsible for getting source information -- the ground truth of
 * translations and the entries that we are interested in showing in the interface.
 */
const SourceDataProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { sourceLanguage } = useURLParams();
  const [dataEntries, setDataEntries] = useState<DataEntry[]>([]);
  const [sourceXMLData, setSourceXMLData] = useState<Record<string, string>>({});

  // Data fetchers
  const fetchDataEntries = useCallback(async () => {
    const dataEntries = await loadDataEntries();
    if (dataEntries) setDataEntries(dataEntries);
  }, [setDataEntries]);
  const fetchXMLData = useCallback(
    async (sourceLanguage: SourceLanguage) => {
      if (dataEntries.length === 0) return;
      const allXMLdata = await loadCLDRXMLWithInheritance(sourceLanguage);
      // Only save XPaths we are using
      const applicableXML = dataEntries.reduce(
        (acc, row) => {
          if (row.xpath == null || !allXMLdata[row.xpath]) return acc;
          acc[row.xpath] = allXMLdata[row.xpath];
          return acc;
        },
        {} as Record<string, string>,
      );
      setSourceXMLData(applicableXML);
    },
    [dataEntries],
  );

  // Data Entry accessors
  const findDataEntries = useCallback(
    (query: Partial<DataEntry>): DataEntry[] =>
      dataEntries.filter((entry) =>
        Object.entries(query).every(([key, value]) => entry[key as keyof DataEntry] === value),
      ),
    [dataEntries],
  );
  const findDataEntry = useCallback(
    (query: Partial<DataEntry>): DataEntry | undefined => findDataEntries(query)[0] || undefined,
    [findDataEntries],
  );
  const getSourceData = useCallback(
    (entry: DataEntry | undefined): string | undefined => {
      if (!entry) return undefined;
      return sourceXMLData[entry.xpath];
    },
    [sourceXMLData],
  );

  //// Triggers to load the data
  // 1. Initial data load
  useEffect(() => {
    if (dataEntries.length === 0) fetchDataEntries();
  }, [dataEntries, fetchDataEntries]);

  // 2. Once it is loaded and/or if we change the source language, load the source XML data
  useEffect(() => {
    // Only if the data entries are loaded
    if (dataEntries.length === 0) return;

    // Load the source XML data
    fetchXMLData(sourceLanguage);
  }, [sourceLanguage, dataEntries, fetchXMLData]);

  const sourceDataStatus = useMemo(() => {
    if (dataEntries.length === 0) return SourceDataStatus.LoadingDataEntries;
    if (Object.keys(sourceXMLData).length === 0) return SourceDataStatus.LoadingSourceData;
    return SourceDataStatus.Ready;
  }, [dataEntries, sourceXMLData]);

  const dataContext: SourceDataContextType = {
    dataEntries,
    findDataEntry,
    findDataEntries,
    getSourceData,
    sourceDataStatus,
  };
  return <SourceDataContext.Provider value={dataContext}>{children}</SourceDataContext.Provider>;
};

export default SourceDataProvider;
