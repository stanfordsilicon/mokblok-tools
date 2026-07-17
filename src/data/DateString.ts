import { type DataEntry } from '@data/DataTypes';
import { DayKeys } from '@data/DayKeys';

type DateStringProps = {
  formatPattern: string;
  getInnerString: (query: Partial<DataEntry>) => string;
  var1?: number;
  var2?: number;
};

// For example "1713855600000", "dd/MM/y – dd/MM/y" or "'week' w 'of' Y"
// TODO support more dateTimeFormats
export function getDateString({
  formatPattern,
  getInnerString,
  var1,
  var2,
}: DateStringProps): string {
  const date1 = new Date(var1 || 0);
  const date2 = var2 ? new Date(var2) : date1;

  // First break out strings like "'week' and 'of'" -- they are literals and should be left as is
  let formatCopy = formatPattern.slice(); // make a copy of the format string to modify
  const literalMatches = formatCopy.match(/'[^']*'/g);
  const literals: string[] = [];
  if (literalMatches) {
    literalMatches.forEach((match) => {
      literals.push(match);
      formatCopy = formatCopy.replace(match, `¤`);
    });
  }

  // Then replace the date components
  const sequences = formatCopy.match(/(.)\1*/g);
  const alreadyMatched = new Set<string>();
  const replaced = sequences
    ?.map((seq) => {
      const date = alreadyMatched.has(seq) ? date2 : date1; // if we've already replaced this sequence, use the second date
      alreadyMatched.add(seq);
      return getDateVariable(seq, date, getInnerString);
    })
    .join('');

  // Finally put the literals back in
  let result = replaced?.slice() ?? ''; // make a copy of the replaced string to modify
  literals.forEach((lit) => {
    result = result.replace('¤', lit.slice(1, -1)); // remove the surrounding single quotes
  });

  return result;
}

function getDateVariable(
  seq: string,
  date: Date,
  getInnerString: (query: Partial<DataEntry>) => string,
) {
  switch (seq) {
    case 'G':
    case 'GGGG':
    case 'GGGGG':
      return getInnerString({
        field: 'G',
        instance: date.getUTCFullYear() < 0 ? '0' : '1',
        length: seq.length === 5 ? 'n' : seq.length === 1 ? 'a' : 'w',
        variant: '',
        exampleNum: '0',
      });
    case 'y':
    case 'Y':
      return Math.abs(date.getUTCFullYear()).toString();
    case 'yy':
      return (date.getUTCFullYear() % 100).toString().padStart(2, '0');
    case 'M':
      return (date.getUTCMonth() + 1).toString();
    case 'MM':
      return (date.getUTCMonth() + 1).toString().padStart(2, '0');
    case 'MMM':
      return getInnerString({
        field: seq[0],
        instance: (date.getUTCMonth() + 1).toString(),
        length: 'a',
        exampleNum: '0',
      });
    case 'L': // L is the stand-alone month
    case 'MMMM': // Formatted month
      return getInnerString({
        field: 'M',
        instance: (date.getUTCMonth() + 1).toString(),
        length: 'w',
        exampleNum: '0',
      });
    case 'w': // Week in year
      return getWeekNumber(date).toLocaleString();
    case 'W': // Week in month
      return Math.ceil(date.getUTCDate() / 7).toLocaleString();
    case 'E':
      return getInnerString({
        field: seq[0],
        instance: DayKeys[date.getDay()],
        length: 'a',
        exampleNum: '0',
      });
    case 'EEEE':
      return getInnerString({
        field: seq[0],
        instance: DayKeys[date.getDay()],
        length: 'w',
        exampleNum: '0',
      });
    case 'd':
      return date.getUTCDate().toString();
    case 'dd':
      return date.getUTCDate().toString().padStart(2, '0');
    case 'a':
      return getInnerString({
        field: 'a',
        instance: date.getHours() < 12 ? 'am' : 'pm',
        length: 'w',
        exampleNum: '0',
      });
    case 'H':
      return date.getHours().toString();
    case 'HH':
      return date.getHours().toString().padStart(2, '0');
    case 'h':
      return (date.getHours() % 12 || 12).toString();
    case 'hh':
      return (date.getHours() % 12 || 12).toString().padStart(2, '0');
    case 'm':
      return date.getMinutes().toString();
    case 'mm':
      return date.getMinutes().toString().padStart(2, '0');
    case 's':
      return date.getSeconds().toString();
    case 'ss':
      return date.getSeconds().toString().padStart(2, '0');
    case 'v':
    case 'z':
      return getInnerString({ field: 'gmtZeroFormat' });
    case 'zzzz':
      return getInnerString({ field: 'metazone', instance: 'GMT', variant: 'daylight' });
    default:
      return seq;
  }
}

function getWeekNumber(d: Date) {
  // Copy date so don't modify original
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  // Set to nearest Thursday: current date + 4 - current day number
  // Make Sunday's day number 7
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  // Get first day of year
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  // Calculate full weeks to nearest Thursday
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}
