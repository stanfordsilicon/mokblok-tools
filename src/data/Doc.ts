export enum Doc {
  Doc1 = 'Doc 1 (Core Data, Date/Time Patterns)',
  Doc2_1 = 'Doc 2 part 1 (Translations, Math)',
  Doc2_2 = 'Doc 2 part 2 (Long Form Text)',
  Doc2_3 = 'Doc 2 part 3 (Numbers, Geography, Currency & Emojis)',
  Doc3 = 'Doc 3 (Emoji Guidance)',
  Doc4 = 'Doc 4 (Digitally Disadvantaged Languages)',
}

export function getDocFileSuffix(doc: Doc): string {
  switch (doc) {
    case Doc.Doc1:
      return '1';
    case Doc.Doc2_1:
      return '2_1';
    case Doc.Doc2_2:
      return '2_2';
    case Doc.Doc2_3:
      return '2_3';
    case Doc.Doc3:
      return '3';
    case Doc.Doc4:
      return '4';
  }
}

export function getDocFileType(doc: Doc): string {
  switch (doc) {
    case Doc.Doc1:
    case Doc.Doc2_1:
    case Doc.Doc2_2:
    case Doc.Doc2_3:
      return 'tsv';
    case Doc.Doc3:
    case Doc.Doc4:
      return 'txt';
  }
}
