import DemoID from '@widgets/review/demo/DemoID';

import type { AlphabetData } from '../DataTypes';
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
  editTranslation(id: string, update: Partial<TranslationInfo>): void;
  editTranslations(ids: string[], update: Partial<TranslationInfo>): void;
  clearAllTranslations(): void;
};

export type WorksheetDataContextType = {
  importedWorksheets: Partial<Record<Worksheet, UseWorksheetState>>;
  worksheetError?: string | null;
  worksheetsLoading?: boolean;
  worksheetRevisions?: Record<string, number | undefined>;
  reloadWorksheets?: () => void;

  alphabetData?: AlphabetData;
  targetDataStatus: TargetDataStatus;
  targetXMLData: Record<string, string>;
  translationBaselines: Record<string, TranslationBaseline>;
};

export type DemoDataContextType = {
  demoVotes: Partial<Record<DemoID, Vote | undefined>>;
  setDemoVote: (demo: DemoID, vote: Vote | ((prevVote?: Vote) => Vote)) => void;
};
