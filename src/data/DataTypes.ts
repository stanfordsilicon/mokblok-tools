export type DataField = {
  subject: string;
  group: string;
  field: string;
  instance: string;
  length: string;
  variant: string;
  exampleNum: string;
  xpath: string;
  ext_id: string;
  english: string;
  englishPattern: string;
  french: string;
  level: string;
  var1?: number;
  var2?: number;
  index: number;
};

export enum SubmissionField {
  English = 'english',
  French = 'french',
  Translated = 'translated',
  Notes = 'notes',
  XPath = 'xpath',
  ExtId = 'ext_id',
}

export type RowData = {
  english: string;
  french: string;
  translated: string;
  notes: string;
  xpath?: string;
  key: string;
};

export enum SourceLanguage {
  English = 'eng',
  French = 'fra',
}

export enum DateField {
  Era = 'era',
  Year = 'year',
  Quarter = 'quarter',
  Month = 'month',
  Week = 'week',
  Day = 'day',
  DayOfWeek = 'day-of-week',
  Hour = 'hour',
  Minute = 'minute',
  Second = 'second',
}

export enum FormatLength {
  Wide = 'wide',
  Abbreviated = 'abbreviated',
  Short = 'short',
  Narrow = 'narrow',
}

export const MonthFormats = [FormatLength.Wide, FormatLength.Abbreviated, FormatLength.Narrow];
export const DayOfWeekFormats = [
  FormatLength.Wide,
  FormatLength.Abbreviated,
  FormatLength.Short,
  FormatLength.Narrow,
];
export const DateFieldFormats = [FormatLength.Wide, FormatLength.Short, FormatLength.Narrow];

export type MonthData = Partial<Record<FormatLength, RowData>>;
export type DayOfWeekData = Partial<Record<FormatLength, RowData>>;
export type DateFieldData = Partial<Record<FormatLength, RowData>>;

export type AlphabetData = {
  characterHistogram: Record<string, number>;
  charactersBase: string[];
  charactersUppercase: string[];
  charactersAuxiliary: string[];
  charactersNumber: string[];
  charactersPunctuation: string[];
  charactersOther: string[];
  writingSystem: string;
};

export type RelativeTimeData = Partial<
  Record<DateField, { '-1': RowData; '0': RowData; '1': RowData }>
>;

export enum TimeCombinationsFormat {
  HM12 = 'hm12',
  HM24 = 'hm24',
  HMS24 = 'hms24',
  HM12TZ = 'hm12tz',
}
export type TimeCombinationsData = Record<
  TimeCombinationsFormat,
  { morning?: RowData; evening: RowData }
>;

export enum TimeIntervalFormat {
  Hour = 'h',
  HourMinute = 'hm',
  HourMinuteTimezone = 'hmv',
  HourTimezone = 'hv',
}
export enum TimeIntervalDifference {
  Period = 'a',
  Hour = 'h',
  Minute = 'm',
}

//ldml/dates/calendars/calendar[@type="gregorian"]/dateTimeFormats/intervalFormats/intervalFormatItem[@id="hm"]/greatestDifference[@id="m"]
type TimeInternalDataInPeriod = Partial<
  Record<TimeIntervalFormat, Partial<Record<TimeIntervalDifference, RowData>>>
>;
export type TimeIntervalsData = {
  h12: TimeInternalDataInPeriod;
  h12alt: TimeInternalDataInPeriod;
  h24: TimeInternalDataInPeriod;
};

// Not yet organized
export type DateCombinationData = RowData[];

export enum SentenceContext {
  InSentence = 'in sentence',
  Standalone = 'standalone',
}

// 4 items, one for each quarter, with different lengths (e.g. "1st quarter", "Q1")
// both as individual items (eg. "1st quarter") and in a combined form (e.g. "1st quarter of 2025")
export type QuartersData = Record<SentenceContext, Partial<Record<FormatLength, RowData>>[]>;

export enum CardinalDirection {
  North = 'north',
  South = 'south',
  East = 'east',
  West = 'west',
}
export type CoordinatesData = Record<CardinalDirection, Partial<Record<FormatLength, RowData>>>;

export type DirectionExamples = RowData[];

export type ErasData = Partial<Record<FormatLength, RowData>>[];

// Order this by order of appearance
export enum DataType {
  Alphabet = 'alphabet',
  DaysOfWeek = 'daysOfWeek',
  Months = 'months',
  Quarters = 'quarters',
  Eras = 'eras',
  DateFields = 'dateFields',
  RelativeTime = 'relativeTime',
  TimeCombinations = 'timeCombinations',
  TimeIntervals = 'timeIntervals',
  DateCombinations = 'dateCombinations',
  DateIntervals = 'dateIntervals',
  EraDateCombinations = 'eraDateCombinations',
  Coordinates = 'coordinates',
  DirectionExamples = 'directionExamples',
  Emojis = 'emojis',
  All = 'all',
}

export type AllData = {
  [DataType.Months]?: MonthData[];
  [DataType.DaysOfWeek]?: DayOfWeekData[];
  [DataType.DateFields]?: Partial<Record<DateField, DateFieldData>>;
  [DataType.Alphabet]?: AlphabetData;
  [DataType.RelativeTime]?: RelativeTimeData;
  [DataType.TimeCombinations]?: TimeCombinationsData;
  [DataType.TimeIntervals]?: TimeIntervalsData;
  [DataType.DateCombinations]?: DateCombinationData;
  [DataType.Quarters]?: QuartersData;
  [DataType.Coordinates]?: CoordinatesData;
  [DataType.DirectionExamples]?: DirectionExamples;
  [DataType.Eras]?: ErasData;
};

export type DataSetters = {
  [DataType.Months]: (monthIndex: number, format: FormatLength, newTranslation: string) => void;
  [DataType.DaysOfWeek]: (dayIndex: number, format: FormatLength, newTranslation: string) => void;
  [DataType.DateFields]: (field: DateField, format: FormatLength, newTranslation: string) => void;
  [DataType.RelativeTime]: (
    field: DateField,
    offset: '-1' | '0' | '1',
    newTranslation: string,
  ) => void;
  [DataType.TimeCombinations]: (
    format: 'hm12' | 'hm24' | 'hms24' | 'hm12tz',
    variant: 'morning' | 'evening',
    newTranslation: string,
  ) => void;
  [DataType.TimeIntervals]: (
    set: keyof TimeIntervalsData,
    format: TimeIntervalFormat,
    difference: TimeIntervalDifference,
    newTranslation: string,
  ) => void;
  [DataType.DateCombinations]: (combinationIndex: number, newTranslation: string) => void;
  [DataType.Quarters]: (
    context: SentenceContext,
    quarterIndex: number,
    format: FormatLength,
    newTranslation: string,
  ) => void;
  [DataType.Coordinates]: (
    format: FormatLength,
    direction: CardinalDirection,
    newTranslation: string,
  ) => void;
  [DataType.DirectionExamples]: (index: number, newTranslation: string) => void;
  [DataType.Eras]: (eraIndex: number, length: FormatLength, newTranslation: string) => void;
};
