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
