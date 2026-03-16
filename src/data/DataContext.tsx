import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import extractAlphabetData from './ExtractAlphabet';
import {
  getDateCombinationData,
  getDateFieldsData,
  getDaysOfWeekData,
  getHourMinuteData,
  getMonthsData,
  getQuarterData,
  getRelativeTimeData,
  getTimeIntervalData,
} from './ExtractData';

import type {
  AlphabetData,
  DateCombinationData,
  DateField,
  DateFieldData,
  DayOfWeekData,
  FormatLength,
  HourMinuteData,
  MonthData,
  QuartersData,
  RelativeTimeData,
  RowData,
  SentenceContext,
  TimeIntervalData,
  TimeIntervalDifference,
  TimeIntervalFormat,
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
  hourMinuteData?: HourMinuteData;
  timeIntervalData?: TimeIntervalData;
  dateCombinationsData?: DateCombinationData;
  quartersData?: QuartersData;
  setMonthTranslation: (monthIndex: number, format: FormatLength, newTranslation: string) => void;
  setDayOfWeekTranslation: (dayIndex: number, format: FormatLength, newTranslation: string) => void;
  setDateFieldTranslation: (field: DateField, format: FormatLength, newTranslation: string) => void;
  setRelativeTimeTranslation: (
    field: DateField,
    offset: '-1' | '0' | '1',
    newTranslation: string,
  ) => void;
  setHourMinuteTranslation: (
    format: 'hm12' | 'hm24' | 'hms24' | 'hm12tz',
    variant: 'morning' | 'evening',
    newTranslation: string,
  ) => void;
  setTimeIntervalTranslation: (
    set: keyof TimeIntervalData,
    format: TimeIntervalFormat,
    difference: TimeIntervalDifference,
    newTranslation: string,
  ) => void;
  setDateCombinationTranslation: (combinationIndex: number, newTranslation: string) => void;
  setQuarterTranslation: (
    context: SentenceContext,
    quarterIndex: number,
    format: FormatLength,
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
  setHourMinuteTranslation: () => {},
  setTimeIntervalTranslation: () => {},
  setDateCombinationTranslation: () => {},
  setQuarterTranslation: () => {},
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
  const [hourMinuteData, setHourMinuteData] = useState<HourMinuteData | undefined>(undefined);
  const [timeIntervalData, setTimeIntervalData] = useState<TimeIntervalData | undefined>(undefined);
  const [dateCombinationsData, setDateCombinationsData] = useState<DateCombinationData | undefined>(
    [],
  );
  const [quartersData, setQuartersData] = useState<QuartersData | undefined>(undefined);

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
    setHourMinuteData(getHourMinuteData(rowsByKey));
    setTimeIntervalData(getTimeIntervalData(rowsByKey));
    setDateCombinationsData(getDateCombinationData(rowsByKey));
    setQuartersData(getQuarterData(rowsByKey));
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
  const setHourMinuteTranslation = (
    format: 'hm12' | 'hm24' | 'hms24' | 'hm12tz',
    variant: 'morning' | 'evening',
    newTranslation: string,
  ) => {
    setHourMinuteData((prev) => {
      if (!prev) return prev;
      const data = prev[format]?.[variant];
      if (data) data.translated = newTranslation;
      return { ...prev };
    });
  };
  const setTimeIntervalTranslation = (
    set: keyof TimeIntervalData,
    format: TimeIntervalFormat,
    difference: TimeIntervalDifference,
    newTranslation: string,
  ) => {
    setTimeIntervalData((prev) => {
      if (!prev) return prev;
      const data = prev[set]?.[format]?.[difference];
      if (data) data.translated = newTranslation;
      return { ...prev };
    });
  };
  const setDateCombinationTranslation = (combinationIndex: number, newTranslation: string) => {
    setDateCombinationsData((prev) => {
      if (!prev) return prev;
      const data = prev[combinationIndex];
      if (data) data.translated = newTranslation;
      return [...prev];
    });
  };
  const setQuarterTranslation = (
    context: SentenceContext,
    quarterIndex: number,
    format: FormatLength,
    newTranslation: string,
  ) => {
    setQuartersData((prev) => {
      if (!prev) return prev;
      const data = prev[context][quarterIndex][format];
      if (data) data.translated = newTranslation;
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
    hourMinuteData,
    timeIntervalData,
    dateCombinationsData,
    quartersData,
    setMonthTranslation,
    setDayOfWeekTranslation,
    setDateFieldTranslation,
    setRelativeTimeTranslation,
    setHourMinuteTranslation,
    setTimeIntervalTranslation,
    setDateCombinationTranslation,
    setQuarterTranslation,
  };
  return <DataContext.Provider value={dataContext}>{children}</DataContext.Provider>;
};
