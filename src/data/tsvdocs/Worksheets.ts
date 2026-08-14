import { DataEntry } from '@data/DataTypes';

import { Doc } from './Doc';

// When people enter the tool, some languages are early on and may only support a subset of the docs, we can use this to limit which is seen
export enum Worksheets {
  W1only = 'w1only',
  W1and2 = 'w1and2',
  W1to4 = 'w1to4',
  Any = 'any', // including items not covered by the original worksheets, which are marked as "5" in the input data
}

export function isEntryInScope(entry: DataEntry, scope: Worksheets): boolean {
  if (scope === Worksheets.Any) return true;
  const docsInScope = getAvailableWorksheets(scope);
  return entry.doc != null && docsInScope.includes(entry.doc);
}

export function getAvailableWorksheets(scope: Worksheets): Doc[] {
  switch (scope) {
    case Worksheets.W1only:
      return [Doc.Doc1];
    case Worksheets.W1and2:
      return [Doc.Doc1, Doc.Doc2_1, Doc.Doc2_2, Doc.Doc2_3];
    case Worksheets.W1to4:
    case Worksheets.Any:
      return [Doc.Doc1, Doc.Doc2_1, Doc.Doc2_2, Doc.Doc2_3, Doc.Doc3, Doc.Doc4];
    // Doc "5" in the input data represents not-in-original-documents
  }
}
