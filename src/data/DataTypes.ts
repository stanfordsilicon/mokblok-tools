import type { CoverageLevel } from './CoverageLevel';
import type { DataPage, DataSection } from './DataSection';
import type { PatternFormat } from './PatternFormat';
import type { Doc } from './tsvdocs/Doc';

export type DataEntry = {
  page: DataPage;
  section: DataSection;
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
  frenchPattern: string;
  level: CoverageLevel;
  var1?: number;
  var2?: number;
  patternFormat: PatternFormat;
  index: number;
  doc?: Doc;
};

export enum SubmissionField {
  English = 'english',
  French = 'french',
  Translated = 'translated',
  Notes = 'notes',
  XPath = 'xpath',
  ExtId = 'ext_id',
}

export enum InterfaceLanguage {
  English = 'en',
  EnglishFraktur = 'en-Latf',
  French = 'fr',
  Italian = 'it',
  Spanish = 'es',
}

export enum SourceLanguage {
  English = 'en',
  EnglishFraktur = 'en-Latf',
  French = 'fr',
  Hausa = 'ha',
  Italian = 'it',
  Malagasy = 'mg',
  Morisien = 'mfe',
  Obolo = 'ann',
  Oromo = 'or',
  Shona = 'sn',
  Spanish = 'es',
  Wolof = 'wo',
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
