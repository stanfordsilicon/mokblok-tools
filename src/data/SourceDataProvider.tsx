import { createContext, useCallback, useContext, useEffect, useState } from 'react';

import { useURLParams } from '@settings/URLParams';

import { SourceLanguage, type DataEntry } from './DataTypes';
import { loadCLDRXMLWithInheritance } from './loadCLDRXML';
import { loadDataEntries } from './LoadDataEntries';

export type FindDataEntry = (query: Partial<DataEntry>) => DataEntry | undefined;
export type FindDataEntries = (query: Partial<DataEntry>) => DataEntry[];
export enum SourceDataStatus {
  Initial,
  LoadingDataEntries,
  LoadedDataEntries,
  LoadingSourceData,
  Ready,
  Error,
}

export type SourceDataContextType = {
  findDataEntry(query: Partial<DataEntry>): DataEntry | undefined;
  findDataEntries(query: Partial<DataEntry>): DataEntry[];
  getSourceData(entry: DataEntry | undefined): string | undefined;
  sourceDataStatus: SourceDataStatus;
};

export const SourceDataContext = createContext<SourceDataContextType | undefined>({
  findDataEntry: () => undefined,
  findDataEntries: () => [],
  getSourceData: () => '',
  sourceDataStatus: SourceDataStatus.Initial,
});

export const useSourceDataContext = () => {
  const context = useContext(SourceDataContext);
  if (!context) throw new Error('useDataContext must be used within a DataProvider');
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
  const [sourceDataStatus, setSourceDataStatus] = useState<SourceDataStatus>(
    SourceDataStatus.Initial,
  );

  // Data fetchers
  const fetchDataEntries = async () => {
    setSourceDataStatus(SourceDataStatus.LoadingDataEntries);
    const dataEntries = await loadDataEntries();
    if (dataEntries) {
      setDataEntries(dataEntries);
      setSourceDataStatus(SourceDataStatus.LoadedDataEntries);
    } else {
      setSourceDataStatus(SourceDataStatus.Error);
    }
  };
  const fetchXMLData = useCallback(
    async (sourceLanguage: SourceLanguage) => {
      setSourceDataStatus(SourceDataStatus.LoadingSourceData);
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
      setSourceDataStatus(SourceDataStatus.Ready);
    },
    [dataEntries],
  );

  // Data Entry accessors
  const findDataEntries = useCallback(
    (query: Partial<DataEntry>): DataEntry[] => {
      return dataEntries.filter((entry) =>
        Object.entries(query).every(([key, value]) => entry[key as keyof DataEntry] === value),
      );
    },
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

  // Triggers to load the data
  useEffect(() => {
    if (sourceDataStatus === SourceDataStatus.Initial) fetchDataEntries();
  }, [sourceDataStatus, fetchDataEntries]);
  useEffect(() => {
    if (sourceDataStatus === SourceDataStatus.LoadedDataEntries) fetchXMLData(sourceLanguage);
  }, [sourceDataStatus, sourceLanguage, fetchXMLData]);
  useEffect(() => {
    // If the source language changes, reload the data
    if (sourceDataStatus >= SourceDataStatus.LoadedDataEntries)
      setSourceDataStatus(SourceDataStatus.LoadedDataEntries);
  }, [sourceLanguage]);

  const dataContext: SourceDataContextType = {
    findDataEntry,
    findDataEntries,
    getSourceData,
    sourceDataStatus,
  };
  return <SourceDataContext.Provider value={dataContext}>{children}</SourceDataContext.Provider>;
};

export default SourceDataProvider;
