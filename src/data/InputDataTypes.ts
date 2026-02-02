export type InputLine = {
  english: string;
  french: string;
  translated: string;
  example: string;
  notes: string;
  xpath: string;
  ext_id: string;
};

export enum InputLanguage {
  abr = 'abr',
  bho = 'bho',
  eng = 'eng',
  fra = 'fra',
  mlg = 'mlg',
}
