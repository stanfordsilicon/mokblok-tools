export enum PatternFormat {
  None = 'none',
  DateTime = 'datetime', // hms -> 0=1713911445000 -> 3:30:45 PM
  DateTimeCombo = 'datetimecombo', // {1} 'at' {0} -> {0}=hms {1}=EEEE -> Tuesday at 3:30:45 PM
  Substitution = 'sub', // Take the {0}st right. -> {0}=1 -> Take the 1st right.
  Sentence = 'sentence', // I finish school in {0} {1}. -> {0}=1 {1}=y -> I finish school in 1 year.
}

export function parsePatternFormat(format: string): PatternFormat {
  switch (format.toLowerCase().replace(/\s+/g, '')) {
    case 'datetime':
      return PatternFormat.DateTime;
    case 'datetimecombo':
      return PatternFormat.DateTimeCombo;
    case 'sub':
      return PatternFormat.Substitution;
    case 'sentence':
      return PatternFormat.Sentence;
    case '':
    case 'none':
      return PatternFormat.None;
    default:
      console.log(`Unknown pattern format: ${format}`);
      return PatternFormat.None;
  }
}
