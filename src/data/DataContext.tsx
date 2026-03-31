import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import {
  CardinalDirection,
  DataType,
  type AllData,
  type AlphabetData,
  type CoordinatesData,
  type DataSetters,
  type DateCombinationData,
  type DateField,
  type DateFieldData,
  type DayOfWeekData,
  type DirectionExamples,
  type ErasData,
  type FormatLength,
  type MonthData,
  type QuartersData,
  type RelativeTimeData,
  type RowData,
  type SentenceContext,
  type TimeCombinationsData,
  type TimeIntervalDifference,
  type TimeIntervalFormat,
  type TimeIntervalsData,
} from './DataTypes';
import extractAlphabetData from './ExtractAlphabet';
import {
  getCoordinatesData,
  getDateCombinationData,
  getDateFieldsData,
  getDaysOfWeekData,
  getDirectionExamples,
  getErasData,
  getMonthsData,
  getQuarterData,
  getRelativeTimeData,
  getTimeCombinationsData,
  getTimeIntervalsData,
} from './ExtractData';

export type DataContextType = {
  setRows: (lines: RowData[]) => void;
  setExtraText: (text: string) => void;
  rowsByKey: Record<string, RowData>;
  data: AllData;
  set: DataSetters;
};

export const DataContext = createContext<DataContextType | undefined>({
  setRows: () => {},
  setExtraText: () => {},
  rowsByKey: {},
  data: {},
  set: {
    [DataType.Months]: () => {},
    [DataType.DaysOfWeek]: () => {},
    [DataType.DateFields]: () => {},
    [DataType.RelativeTime]: () => {},
    [DataType.TimeCombinations]: () => {},
    [DataType.TimeIntervals]: () => {},
    [DataType.DateCombinations]: () => {},
    [DataType.Quarters]: () => {},
    [DataType.Coordinates]: () => {},
    [DataType.DirectionExamples]: () => {},
    [DataType.Eras]: () => {},
  },
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
  const [timeCombinations, setTimeCombinationsData] = useState<TimeCombinationsData | undefined>(
    undefined,
  );
  const [timeIntervalsData, setTimeIntervalsData] = useState<TimeIntervalsData | undefined>(
    undefined,
  );
  const [dateCombinationsData, setDateCombinationsData] = useState<DateCombinationData | undefined>(
    [],
  );
  const [quartersData, setQuartersData] = useState<QuartersData | undefined>(undefined);
  const [coordinatesData, setCoordinatesData] = useState<CoordinatesData | undefined>(undefined);
  const [directionExamples, setDirectionExamples] = useState<DirectionExamples | undefined>(
    undefined,
  );
  const [erasData, setErasData] = useState<ErasData | undefined>(undefined);
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
    setTimeCombinationsData(getTimeCombinationsData(rowsByKey));
    setTimeIntervalsData(getTimeIntervalsData(rowsByKey));
    setDateCombinationsData(getDateCombinationData(rowsByKey));
    setQuartersData(getQuarterData(rowsByKey));
    setCoordinatesData(getCoordinatesData(rowsByKey));
    setDirectionExamples(getDirectionExamples(rowsByKey));
    setErasData(getErasData(rowsByKey));
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
  const setTimeIntervalsTranslation = (
    set: keyof TimeIntervalsData,
    format: TimeIntervalFormat,
    difference: TimeIntervalDifference,
    newTranslation: string,
  ) => {
    setTimeIntervalsData((prev) => {
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
  const setCoordinatesTranslation = (
    format: FormatLength,
    direction: CardinalDirection,
    newTranslation: string,
  ) => {
    setCoordinatesData((prev) => {
      if (!prev) return prev;
      const data = prev[direction][format];
      if (data) data.translated = newTranslation;
      return { ...prev };
    });
  };
  const setDirectionExample = (index: number, newTranslation: string) => {
    setDirectionExamples((prev) => {
      if (!prev) return prev;
      const example = prev[index];
      if (example) example.translated = newTranslation;
      return [...prev];
    });
  };
  const setEraData = (eraIndex: number, length: FormatLength, newTranslation: string) => {
    setErasData((prev) => {
      if (!prev) return prev;
      const era = prev[eraIndex][length];
      if (era) era.translated = newTranslation;
      return [...prev];
    });
  };

  const dataContext: DataContextType = {
    setRows,
    setExtraText,
    rowsByKey,
    data: {
      months: monthsData,
      daysOfWeek: daysOfWeekData,
      dateFields: dateFieldsData,
      alphabet: alphabetData,
      relativeTime: relativeTimeData,
      timeCombinations,
      timeIntervals: timeIntervalsData,
      dateCombinations: dateCombinationsData,
      quarters: quartersData,
      coordinates: coordinatesData,
      directionExamples,
      eras: erasData,
    },
    set: {
      months: setMonthTranslation,
      daysOfWeek: setDayOfWeekTranslation,
      dateFields: setDateFieldTranslation,
      relativeTime: setRelativeTimeTranslation,
      timeCombinations: setTimeCombinationsTranslation,
      timeIntervals: setTimeIntervalsTranslation,
      dateCombinations: setDateCombinationTranslation,
      quarters: setQuarterTranslation,
      coordinates: setCoordinatesTranslation,
      directionExamples: setDirectionExample,
      eras: setEraData,
    },
  };
  return <DataContext.Provider value={dataContext}>{children}</DataContext.Provider>;
};
