import enforceExhaustiveSwitch from '@shared/enforceExhaustiveSwitch';

import { DataSection } from '../DataSection';

import { Worksheet } from './Worksheet';

export function getWorksheetForSection(section: DataSection) {
  switch (section) {
    case DataSection.DateFields:
    case DataSection.DayPeriods:
    case DataSection.DaysOfWeek:
    case DataSection.Months:
    case DataSection.Times:
    case DataSection.RelativeTime:
    case DataSection.TimeIntervals:
    case DataSection.Dates:
    case DataSection.DateIntervals:
    case DataSection.DateTimes:
    case DataSection.EraDates:
    case DataSection.Coordinates:
    case DataSection.DirectionExamples:
    case DataSection.Quarters:
    case DataSection.Eras:
      return Worksheet.W1;
    // case DataSection.Countries:
    case DataSection.Plurals:
    case DataSection.LanguageNames:
    case DataSection.Maths:
    case DataSection.Symbols:
    case DataSection.TechWords:
    case DataSection.Quotes:
      return Worksheet.W2_1;
    case DataSection.Paragraphs:
    case DataSection.CLDRTicket:
      return Worksheet.W2_2;
    // case DataSection.NumbersCompactLong:
    // case DataSection.Currencies:
    case DataSection.Emoji:
    case DataSection.Regions:
    case DataSection.Timezones:
      return Worksheet.W2_3;
    case DataSection.All:
    case DataSection.Alphabet:
    case DataSection.FullTable:
      return undefined;
    default:
      enforceExhaustiveSwitch(section);
  }
}

export function getDataSectionsForWorksheet(tsv: Worksheet) {
  return Object.values(DataSection).filter((section) => getWorksheetForSection(section) === tsv);
}
