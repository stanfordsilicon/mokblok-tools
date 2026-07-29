import { DataSection } from '@data/DataSection';
import { Doc } from '@data/tsvdocs/Doc';

import enforceExhaustiveSwitch from '@shared/enforceExhaustiveSwitch';

export function getTSVForDataSection(section: DataSection) {
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
      return Doc.Doc1;
    // case DataSection.Countries:
    case DataSection.Plurals:
    case DataSection.LanguageNames:
    case DataSection.Maths:
    case DataSection.Symbols:
    case DataSection.TechWords:
    case DataSection.Quotes:
      return Doc.Doc2_1;
    case DataSection.Paragraphs:
    case DataSection.CLDRTicket:
      return Doc.Doc2_2;
    // case DataSection.NumbersCompactLong:
    // case DataSection.Currencies:
    case DataSection.Emoji:
    case DataSection.Regions:
    case DataSection.Timezones:
      return Doc.Doc2_3;
    case DataSection.All:
    case DataSection.Alphabet:
    case DataSection.FullTable:
      return undefined;
    default:
      enforceExhaustiveSwitch(section);
  }
}

export function getDataSectionsForTSV(tsv: Doc) {
  return Object.values(DataSection).filter((section) => getTSVForDataSection(section) === tsv);
}
