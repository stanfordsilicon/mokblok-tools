import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { getDateFieldsData, getDaysOfWeekData, getMonthsData } from './ExtractData';

import type {
  DateField,
  DateFieldData,
  DayOfWeekData,
  FormatLength,
  MonthData,
  RowData,
} from './DataTypes';

export type DataContextType = {
  setRows: (lines: RowData[]) => void;
  rowsByExtID: Record<string, RowData>;
  monthsData: MonthData[];
  daysOfWeekData: DayOfWeekData[];
  dateFieldsData: Partial<Record<DateField, DateFieldData>>;
  setMonthTranslation: (monthIndex: number, format: FormatLength, newTranslation: string) => void;
  setDayOfWeekTranslation: (dayIndex: number, format: FormatLength, newTranslation: string) => void;
  setDateFieldTranslation: (field: DateField, format: FormatLength, newTranslation: string) => void;
};

export const DataContext = createContext<DataContextType | undefined>({
  setRows: () => {},
  rowsByExtID: {},
  monthsData: [],
  daysOfWeekData: [],
  dateFieldsData: {},
  setMonthTranslation: () => {},
  setDayOfWeekTranslation: () => {},
  setDateFieldTranslation: () => {},
});

export const useDataContext = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useDataContext must be used within a DataProvider');
  return context;
};

export const DataProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [rows, setRows] = useState<RowData[]>([]);
  const [monthsData, setMonthsData] = useState<MonthData[]>([]);
  const [daysOfWeekData, setDaysOfWeekData] = useState<DayOfWeekData[]>([]);
  const [dateFieldsData, setDateFieldsData] = useState<Partial<Record<DateField, DateFieldData>>>(
    {},
  );

  const rowsByExtID = useMemo(
    () =>
      rows.reduce(
        (acc, line) => {
          acc[line.ext_id] = line;
          return acc;
        },
        {} as Record<string, RowData>,
      ),
    [rows],
  );

  // When the inputted data changes, refresh the data
  useEffect(() => {
    setMonthsData(getMonthsData(rowsByExtID));
    setDateFieldsData(getDateFieldsData(rowsByExtID));
    setDaysOfWeekData(getDaysOfWeekData(rowsByExtID));
  }, [rowsByExtID]);

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

  const dataContext: DataContextType = {
    setRows: setRows,
    rowsByExtID,
    monthsData,
    daysOfWeekData,
    dateFieldsData,
    setMonthTranslation,
    setDayOfWeekTranslation,
    setDateFieldTranslation,
  };
  return <DataContext.Provider value={dataContext}>{children}</DataContext.Provider>;
};
