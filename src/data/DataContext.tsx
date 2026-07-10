import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { useURLParams } from '@settings/URLParams';

import { type AlphabetData, type DataField, type RowData } from './DataTypes';
import extractAlphabetData from './ExtractAlphabet';
import { loadCLDRXMLWithInheritance } from './loadCLDRXML';
import { loadDatafields } from './LoadDataFields';

export type FindDataField = (query: Partial<DataField>) => DataField | undefined;
export type FindDataFields = (query: Partial<DataField>) => DataField[];

export type DataContextType = {
  setRows: (lines: RowData[]) => void;
  setExtraText: (text: string) => void;
  rowsByKey: Record<string, RowData>;
  alphabet?: AlphabetData;
  findDataField(query: Partial<DataField>): DataField | undefined;
  findDataFields(query: Partial<DataField>): DataField[];
  getTranslation(field: DataField | undefined, fallback?: boolean): string;
  setTranslation(index: number, newTranslation: string): void;
  getSourceData(field: DataField | undefined): string | undefined;
};

export const DataContext = createContext<DataContextType | undefined>({
  setRows: () => {},
  setExtraText: () => {},
  rowsByKey: {},
  findDataField: () => undefined,
  findDataFields: () => [],
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
  const [dataFields, setDataFields] = useState<DataField[]>([]);
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

  // Load the list of datafields
  useEffect(() => {
    const fetchDatafields = async () => {
      const datafields = await loadDatafields();
      if (datafields) setDataFields(datafields);
    };
    fetchDatafields();
  }, []);
  const findDataFields = useCallback(
    (query: Partial<DataField>): DataField[] => {
      return dataFields.filter((field) =>
        Object.entries(query).every(([key, value]) => field[key as keyof DataField] === value),
      );
    },
    [dataFields],
  );
  const findDataField = useCallback(
    (query: Partial<DataField>): DataField | undefined => findDataFields(query)[0] || undefined,
    [findDataFields],
  );
  const getTranslation = useCallback(
    (datum: DataField | undefined, fallback = true): string => {
      if (!datum) return '';
      return translationsByIndex[datum.index] ?? (fallback ? datum.english : '');
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
        const field = findDataField({ ext_id: key }) ?? findDataField({ xpath: key });
        if (field && row.translated) {
          setTranslation(field.index, row.translated);
        }
      });
    },
    [dataFields.length, setTranslation],
  );
  const getSourceData = useCallback(
    (field: DataField | undefined): string | undefined => {
      if (!field) return undefined;
      return sourceXMLData[field.xpath];
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
      if (dataFields.length === 0) return;
      const allXMLdata = await loadCLDRXMLWithInheritance(sourceLanguage);
      // Only save XPaths we are using
      const applicableXML = dataFields.reduce(
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
  }, [sourceLanguage, dataFields]);

  const dataContext: DataContextType = {
    setRows,
    setExtraText,
    rowsByKey,
    alphabet: alphabetData,
    findDataField,
    findDataFields,
    getTranslation,
    getSourceData,
    setTranslation,
  };
  return <DataContext.Provider value={dataContext}>{children}</DataContext.Provider>;
};
