export type RowData = {
  english: string;
  french: string;
  translated: string;
  example: string;
  notes: string;
  xpath: string;
  ext_id: string;
};

export enum InputLanguage {
  Abron = 'abr',
  Bhojpuri = 'bho',
  English = 'eng',
  French = 'fra',
  Malagasy = 'mlg',
}

export enum SourceLanguage {
  English = 'eng',
  French = 'fra',
}

export const enum DateField {
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

export type MonthData = {
  wide?: RowData;
  abbreviated?: RowData;
  narrow?: RowData;
};

export type DayOfWeekData = {
  wide?: RowData;
  abbreviated?: RowData;
  short?: RowData;
  narrow?: RowData;
};

export type DateFieldData = {
  wide?: RowData;
  short?: RowData;
  narrow?: RowData;
};
