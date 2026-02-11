export type RowData = {
  english: string;
  french: string;
  translated: string;
  example: string;
  notes: string;
  xpath: string;
  ext_id: string;
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
