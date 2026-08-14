export enum Worksheet {
  W1 = 'Worksheet 1',
  W2_1 = 'Worksheet 2 part 1',
  W2_2 = 'Worksheet 2 part 2',
  W2_3 = 'Worksheet 2 part 3',
  W3 = 'Worksheet 3',
  W4 = 'Worksheet 4',
}

export function getWorksheetFileSuffix(worksheet: Worksheet): string {
  switch (worksheet) {
    case Worksheet.W1:
      return '1';
    case Worksheet.W2_1:
      return '2_1';
    case Worksheet.W2_2:
      return '2_2';
    case Worksheet.W2_3:
      return '2_3';
    case Worksheet.W3:
      return '3';
    case Worksheet.W4:
      return '4';
  }
}

export function parseWorksheetName(input: string): Worksheet | undefined {
  const normalizedInput = input.toLowerCase().replaceAll('Worksheet', '').trim();
  switch (normalizedInput) {
    case '1':
      return Worksheet.W1;
    case '2 part 1':
    case '2_1':
      return Worksheet.W2_1;
    case '2 part 2':
    case '2_2':
      return Worksheet.W2_2;
    case '2 part 3':
    case '2_3':
      return Worksheet.W2_3;
    case '3':
      return Worksheet.W3;
    case '4':
      return Worksheet.W4;
    case '5': // Not in original Worksheetument
    default:
      return undefined;
  }
}

export function getWorksheetFileType(worksheet: Worksheet): string {
  switch (worksheet) {
    case Worksheet.W1:
    case Worksheet.W2_1:
    case Worksheet.W2_2:
    case Worksheet.W2_3:
      return 'tsv';
    case Worksheet.W3:
    case Worksheet.W4:
      return 'txt';
  }
}
