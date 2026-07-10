import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { useURLParams } from '@settings/URLParams';

import { type AlphabetData, type DataEntry, type RowData } from './DataTypes';
import extractAlphabetData from './ExtractAlphabet';
import { loadCLDRXMLWithInheritance } from './loadCLDRXML';
import { loadDataEntries } from './LoadDataEntries';

export type FindDataEntry = (query: Partial<DataEntry>) => DataEntry | undefined;
export type FindDataEntries = (query: Partial<DataEntry>) => DataEntry[];

export type DataContextType = {
  setRows: (lines: RowData[]) => void;
  setExtraText: (text: string) => void;
  rowsByKey: Record<string, RowData>;
  alphabet?: AlphabetData;
  findDataEntry(query: Partial<DataEntry>): DataEntry | undefined;
  findDataEntries(query: Partial<DataEntry>): DataEntry[];
  getTranslation(entry: DataEntry | undefined, fallback?: boolean): string;
  setTranslation(index: number, newTranslation: string): void;
  getSourceData(entry: DataEntry | undefined): string | undefined;
};

export const DataContext = createContext<DataContextType | undefined>({
  setRows: () => {},
  setExtraText: () => {},
  rowsByKey: {},
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

export const DataProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  // Input Data
  const [rows, setRows] = useState<RowData[]>([]);
  const [dataEntries, setDataEntries] = useState<DataEntry[]>([]);
  const [extraText, setExtraText] = useState<string>('');
  const [sourceXMLData, setSourceXMLData] = useState<Record<string, string>>({});
  const { sourceLanguage } = useURLParams();

  // Structured Data
  const [alphabetData, setAlphabetData] = useState<AlphabetData | undefined>(undefined);
  const rowsByKey = useMemo(
    () =>
      rows.reduce(
        (acc, line) => {
          acc[line.key] = line;
          return acc;
        },
        {} as Record<string, RowData>,
      ),
    [rows],
  );
  const [translationsByIndex, setTranslationsByIndex] = useState<Record<number, string>>({});

  // Load the list of data entries
  useEffect(() => {
    const fetchDataEntries = async () => {
      const dataEntries = await loadDataEntries();
      if (dataEntries) setDataEntries(dataEntries);
    };
    fetchDataEntries();
  }, []);
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
  const getTranslation = useCallback(
    (entry: DataEntry | undefined, fallback = true): string => {
      if (!entry) return '';
      return translationsByIndex[entry.index] ?? (fallback ? entry.english : '');
    },
    [translationsByIndex],
  );
  const setTranslation = useCallback((index: number, newTranslation: string) => {
    setTranslationsByIndex((prev) => ({ ...prev, [index]: newTranslation }));
  }, []);
  const fillTranslations = useCallback(
    (rowsByKey: Record<string, RowData>) => {
      setTranslationsByIndex({}); // Clear existing translations
      Object.entries(rowsByKey).forEach(([key, row]) => {
        const entry = findDataEntry({ ext_id: key }) ?? findDataEntry({ xpath: key });
        if (entry && row.translated) {
          setTranslation(entry.index, row.translated);
        }
      });
    },
    [dataEntries.length, setTranslation],
  );
  const getSourceData = useCallback(
    (entry: DataEntry | undefined): string | undefined => {
      if (!entry) return undefined;
      return sourceXMLData[entry.xpath];
    },
    [sourceXMLData],
  );

  // When the inputted data changes, refresh the data
  useEffect(() => {
    setAlphabetData(extractAlphabetData(rows, extraText));
    fillTranslations(rowsByKey);
  }, [rowsByKey, rows, extraText]);
  useEffect(() => {
    const fetchXMLData = async () => {
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
    };
    fetchXMLData();
  }, [sourceLanguage, dataEntries]);

  const dataContext: DataContextType = {
    setRows,
    setExtraText,
    rowsByKey,
    alphabet: alphabetData,
    findDataEntry,
    findDataEntries,
    getTranslation,
    getSourceData,
    setTranslation,
  };
  return <DataContext.Provider value={dataContext}>{children}</DataContext.Provider>;
};
