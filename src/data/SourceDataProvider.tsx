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

export const SourceDataContext = createContext<SourceDataContextType>({
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
  const [sourceDataStatus, setSourceDataStatus] = useState<SourceDataStatus>(
    SourceDataStatus.Initial,
  );

  // Data fetchers
  const fetchDataEntries = useCallback(async () => {
    if (sourceDataStatus !== SourceDataStatus.Initial) return;
    setSourceDataStatus(SourceDataStatus.LoadingDataEntries);
    const dataEntries = await loadDataEntries();
    if (dataEntries) {
      setDataEntries(dataEntries);
      setSourceDataStatus(SourceDataStatus.LoadedDataEntries);
    } else {
      setSourceDataStatus(SourceDataStatus.Error);
    }
  }, []);
  const fetchXMLData = useCallback(
    async (sourceLanguage: SourceLanguage) => {
      if (dataEntries.length === 0) return;
      setSourceDataStatus(SourceDataStatus.LoadingSourceData);
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

  // Triggers to load the data
  useEffect(() => {
    if (sourceDataStatus === SourceDataStatus.Initial) fetchDataEntries();
  }, [sourceDataStatus]);
  useEffect(() => {
    if (sourceDataStatus === SourceDataStatus.LoadedDataEntries) fetchXMLData(sourceLanguage);
  }, [sourceDataStatus, sourceLanguage]);
  useEffect(() => {
    // If the source language changes, reload the data.
    //
    // sourceDataStatus is deliberately NOT a dependency. This effect invalidates
    // loaded data when the LANGUAGE changes; subscribing it to the status as
    // well made it fight the loader above. The loader advances
    // LoadedDataEntries -> LoadingSourceData, this effect then re-ran, saw a
    // status past LoadedDataEntries and pulled it straight back, which
    // re-triggered the loader: an infinite render loop ("Maximum update depth
    // exceeded" at setSourceXMLData) that also fired a fresh CLDR fetch on every
    // pass. Reading the status without subscribing to it is exactly the intent,
    // so the exhaustive-deps warning is suppressed rather than satisfied.
    if (sourceDataStatus > SourceDataStatus.LoadedDataEntries)
      setSourceDataStatus(SourceDataStatus.LoadedDataEntries);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
