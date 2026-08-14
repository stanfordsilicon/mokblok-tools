import { DataEntry } from '@data/DataTypes';

import { Worksheet } from './Worksheet';

// When people enter the tool, some languages are early on and may only support a subset of the docs, we can use this to limit which is seen
export enum Worksheets {
  W1only = 'w1only',
  W1and2 = 'w1and2',
  W1to4 = 'w1to4',
  Any = 'any', // including items not covered by the original worksheets, which are marked as "5" in the input data
}

export function isEntryInWorksheetScope(entry: DataEntry, scope: Worksheets): boolean {
  if (scope === Worksheets.Any) return true;
  const availableWorksheets = getAvailableWorksheets(scope);
  return entry.worksheet != null && availableWorksheets.includes(entry.worksheet);
}

export function getAvailableWorksheets(scope: Worksheets): Worksheet[] {
  switch (scope) {
    case Worksheets.W1only:
      return [Worksheet.W1];
    case Worksheets.W1and2:
      return [Worksheet.W1, Worksheet.W2_1, Worksheet.W2_2, Worksheet.W2_3];
    case Worksheets.W1to4:
    case Worksheets.Any:
      return [
        Worksheet.W1,
        Worksheet.W2_1,
        Worksheet.W2_2,
        Worksheet.W2_3,
        Worksheet.W3,
        Worksheet.W4,
      ];
    // Worksheet "5" in the input data represents not-in-original-documents
  }
}
