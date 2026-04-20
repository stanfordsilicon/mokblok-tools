import type { CoverageLevel } from './CoverageLevel';

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
  level: CoverageLevel;
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
  french?: string;
  translated: string;
  notes: string;
  xpath?: string;
  key: string;
};

export enum SourceLanguage {
  English = 'eng',
  French = 'fra',
}

export enum FormatLength {
  Wide = 'wide',
  Abbreviated = 'abbreviated',
  Short = 'short',
  Narrow = 'narrow',
}

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

export enum SentenceContext {
  InSentence = 'f',
  Standalone = 's',
}

export enum CardinalDirection {
  North = 'north',
  South = 'south',
  East = 'east',
  West = 'west',
}

// Order this by order of appearance
export enum DataType {
  Alphabet = 'alphabet',
  Symbols = 'symbols',
  Quotes = 'quotes',
  Maths = 'maths',

  // Date and time
  DateFields = 'dateFields',
  DayPeriods = 'dayPeriods',
  DaysOfWeek = 'daysOfWeek',
  Months = 'months',
  Quarters = 'quarters',
  Eras = 'eras',

  RelativeTime = 'relativeTime',
  TimeCombinations = 'timeCombinations',
  TimeIntervals = 'timeIntervals',
  DateCombinations = 'dateCombinations',
  DateIntervals = 'dateIntervals',
  DateTimeCombinations = 'dateTimeCombinations',
  EraDateCombinations = 'eraDateCombinations',

  // Quantities
  Coordinates = 'coordinates',
  DirectionExamples = 'directionExamples',

  // Translations
  Timezones = 'timezones',
  Emojis = 'emojis',
  TechWords = 'techWords',
  Paragraphs = 'paragraphs',
  CLDRTicket = 'cldrTicket',

  All = 'all',
}
