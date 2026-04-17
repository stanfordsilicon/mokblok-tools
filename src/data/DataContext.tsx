import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import {
  DataType,
  type AllData,
  type AlphabetData,
  type DataField,
  type DataSetters,
  type RowData,
  type TimeCombinationsData,
} from './DataTypes';
import extractAlphabetData from './ExtractAlphabet';
import { getTimeCombinationsData } from './ExtractData';
import { loadDatafields } from './LoadDataFields';

export type DataContextType = {
  setRows: (lines: RowData[]) => void;
  setExtraText: (text: string) => void;
  rowsByKey: Record<string, RowData>;
  data: AllData;
  set: DataSetters;
  findDataField(query: Partial<DataField>): DataField | undefined;
  findDataFields(query: Partial<DataField>): DataField[];
  getTranslation(field: DataField): string;
  setTranslation(index: number, newTranslation: string): void;
};

export const DataContext = createContext<DataContextType | undefined>({
  setRows: () => {},
  setExtraText: () => {},
  rowsByKey: {},
  data: {},
  set: {
    [DataType.TimeCombinations]: () => {},
  },
  findDataField: () => undefined,
  findDataFields: () => [],
  getTranslation: () => '',
  setTranslation: () => {},
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

  // Structured Data
  const [alphabetData, setAlphabetData] = useState<AlphabetData | undefined>(undefined);
  const [timeCombinations, setTimeCombinationsData] = useState<TimeCombinationsData | undefined>(
    undefined,
  );
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
    (datum: DataField | undefined): string => {
      if (!datum) return '';
      return translationsByIndex[datum.index] ?? datum.english;
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

  // When the inputted data changes, refresh the data
  useEffect(() => {
    setTimeCombinationsData(getTimeCombinationsData(rowsByKey));
    setAlphabetData(extractAlphabetData(rows, extraText));
    fillTranslations(rowsByKey);
  }, [rowsByKey, rows, extraText]);

  // Translation Setters
  const setTimeCombinationsTranslation = (
    format: 'hm12' | 'hm24' | 'hms24' | 'hm12tz',
    variant: 'morning' | 'evening',
    newTranslation: string,
  ) => {
    setTimeCombinationsData((prev) => {
      if (!prev) return prev;
      const data = prev[format]?.[variant];
      if (data) data.translated = newTranslation;
      return { ...prev };
    });
  };

  const dataContext: DataContextType = {
    setRows,
    setExtraText,
    rowsByKey,
    data: {
      alphabet: alphabetData,
      timeCombinations,
    },
    set: {
      timeCombinations: setTimeCombinationsTranslation,
    },
    findDataField,
    findDataFields,
    getTranslation,
    setTranslation,
  };
  return <DataContext.Provider value={dataContext}>{children}</DataContext.Provider>;
};
