import type { AlphabetData, DataEntry } from '../DataTypes';
import type { UseWorksheetState } from '../worksheets/useWorksheetState';
import type { Worksheet } from '../worksheets/Worksheet';

export enum TargetDataStatus {
  WaitingOnSourceData,
  LoadingBaselineData,
  Ready,
}

export enum Vote {
  Unknown,
  Reject,
  Accept,
}

export type TranslationBaseline = {
  id: string;
  source: string;
  translation?: string;
};

export type TranslationEdit = {
  id: string;
  edit?: string;
  vote?: Vote;
  comment?: string;
};

export type TranslationInfo = TranslationBaseline & TranslationEdit;

export type PersistedTranslationInfo = Pick<TranslationInfo, 'id' | 'edit' | 'vote' | 'comment'>;

export type ReviewDraftResponse = {
  success?: boolean;
  entries?: PersistedTranslationInfo[];
};

export type TargetDataContextType = {
  alphabet?: AlphabetData;
  editTranslation(id: string, update: Partial<TranslationInfo>): void;
  editTranslations(ids: string[], update: Partial<TranslationInfo>): void;
  getTranslation(entry: DataEntry | undefined, fallback?: boolean): string;
  getTranslationInfo(entry: DataEntry | undefined): TranslationInfo;
  getTranslations(entries?: DataEntry[], scope?: 'edited' | 'all'): TranslationInfo[];
  importedWorksheets: Partial<Record<Worksheet, UseWorksheetState>>;
  targetDataStatus: TargetDataStatus;
  targetXMLData: Record<string, string>;
};
