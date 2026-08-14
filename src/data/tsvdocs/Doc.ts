export enum Doc {
  Doc1 = 'Doc 1',
  Doc2_1 = 'Doc 2 part 1',
  Doc2_2 = 'Doc 2 part 2',
  Doc2_3 = 'Doc 2 part 3',
  Doc3 = 'Doc 3',
  Doc4 = 'Doc 4',
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

export function parseDocFromInput(input: string): Doc | undefined {
  const normalizedInput = input.toLowerCase().replaceAll('doc', '').trim();
  switch (normalizedInput) {
    case '1':
      return Doc.Doc1;
    case '2 part 1':
    case '2_1':
      return Doc.Doc2_1;
    case '2 part 2':
    case '2_2':
      return Doc.Doc2_2;
    case '2 part 3':
    case '2_3':
      return Doc.Doc2_3;
    case '3':
      return Doc.Doc3;
    case '4':
      return Doc.Doc4;
    case '5': // Not in original document
    default:
      return undefined;
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
