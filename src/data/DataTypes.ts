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

export enum HourMinuteFormat {
  HM12 = 'hm12',
  HM24 = 'hm24',
  HMS24 = 'hms24',
  HM12TZ = 'hm12tz',
}
export type HourMinuteData = Record<HourMinuteFormat, { morning?: RowData; evening: RowData }>;

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
export type TimeIntervalData = {
  h12: TimeInternalDataInPeriod;
  h12alt: TimeInternalDataInPeriod;
  h24: TimeInternalDataInPeriod;
};

// Not yet organized
export type DateCombinationData = RowData[];
