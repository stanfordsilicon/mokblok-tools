import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import extractAlphabetData from './ExtractAlphabet';
import {
  getDateFieldsData,
  getDaysOfWeekData,
  getMonthsData,
  getRelativeTimeData,
} from './ExtractData';

import type {
  AlphabetData,
  DateField,
  DateFieldData,
  DayOfWeekData,
  FormatLength,
  MonthData,
  RelativeTimeData,
  RowData,
} from './DataTypes';

export type DataContextType = {
  setRows: (lines: RowData[]) => void;
  setExtraText: (text: string) => void;
  rowsByKey: Record<string, RowData>;
  monthsData: MonthData[];
  daysOfWeekData: DayOfWeekData[];
  dateFieldsData: Partial<Record<DateField, DateFieldData>>;
  alphabetData?: AlphabetData;
  relativeTimeData?: RelativeTimeData;
  setMonthTranslation: (monthIndex: number, format: FormatLength, newTranslation: string) => void;
  setDayOfWeekTranslation: (dayIndex: number, format: FormatLength, newTranslation: string) => void;
  setDateFieldTranslation: (field: DateField, format: FormatLength, newTranslation: string) => void;
  setRelativeTimeTranslation: (
    field: DateField,
    offset: '-1' | '0' | '1',
    newTranslation: string,
  ) => void;
};

export const DataContext = createContext<DataContextType | undefined>({
  setRows: () => {},
  setExtraText: () => {},
  rowsByKey: {},
  monthsData: [],
  daysOfWeekData: [],
  dateFieldsData: {},
  setMonthTranslation: () => {},
  setDayOfWeekTranslation: () => {},
  setDateFieldTranslation: () => {},
  setRelativeTimeTranslation: () => {},
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
  const [extraText, setExtraText] = useState<string>('');

  // Structured Data
  const [monthsData, setMonthsData] = useState<MonthData[]>([]);
  const [daysOfWeekData, setDaysOfWeekData] = useState<DayOfWeekData[]>([]);
  const [dateFieldsData, setDateFieldsData] = useState<Partial<Record<DateField, DateFieldData>>>(
    {},
  );
  const [alphabetData, setAlphabetData] = useState<AlphabetData | undefined>(undefined);
  const [relativeTimeData, setRelativeTimeData] = useState<RelativeTimeData>({});

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

  // When the inputted data changes, refresh the data
  useEffect(() => {
    setMonthsData(getMonthsData(rowsByKey));
    setDateFieldsData(getDateFieldsData(rowsByKey));
    setDaysOfWeekData(getDaysOfWeekData(rowsByKey));
    setRelativeTimeData(getRelativeTimeData(rowsByKey));
    setAlphabetData(extractAlphabetData(rows, extraText));
  }, [rowsByKey, rows, extraText]);

  // Translation Setters
  const setMonthTranslation = (
    monthIndex: number,
    format: keyof MonthData,
    newTranslation: string,
  ) => {
    setMonthsData((prev) => {
      const monthFormat = prev[monthIndex][format];
      if (monthFormat) monthFormat.translated = newTranslation;
      return [...prev];
    });
  };
  const setDayOfWeekTranslation = (
    dayIndex: number,
    format: keyof DayOfWeekData,
    newTranslation: string,
  ) => {
    setDaysOfWeekData((prev) => {
      const dayFormat = prev[dayIndex][format];
      if (dayFormat) dayFormat.translated = newTranslation;
      return [...prev];
    });
  };
  const setDateFieldTranslation = (
    field: DateField,
    format: keyof DateFieldData,
    newTranslation: string,
  ) => {
    setDateFieldsData((prev) => {
      const fieldFormat = prev[field]?.[format];
      if (fieldFormat) fieldFormat.translated = newTranslation;
      return { ...prev };
    });
  };
  const setRelativeTimeTranslation = (
    field: DateField,
    offset: '-1' | '0' | '1',
    newTranslation: string,
  ) => {
    setRelativeTimeData((prev) => {
      const fieldOffset = prev[field]?.[offset];
      if (fieldOffset) fieldOffset.translated = newTranslation;
      return { ...prev };
    });
  };

  const dataContext: DataContextType = {
    setRows,
    setExtraText,
    rowsByKey,
    monthsData,
    daysOfWeekData,
    dateFieldsData,
    alphabetData,
    relativeTimeData,
    setMonthTranslation,
    setDayOfWeekTranslation,
    setDateFieldTranslation,
    setRelativeTimeTranslation,
  };
  return <DataContext.Provider value={dataContext}>{children}</DataContext.Provider>;
};
