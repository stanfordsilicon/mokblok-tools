import { DataPage, DataSection } from './DataSection';

const SECTION_LABELS: Record<DataSection, string> = {
  [DataSection.Alphabet]: 'Alphabet',
  [DataSection.CLDRTicket]: 'CLDR Ticket',
  [DataSection.Coordinates]: 'Coordinates',
  [DataSection.DateCombinations]: 'Dates',
  [DataSection.DateFields]: 'Date Fields',
  [DataSection.DateIntervals]: 'Date Intervals',
  [DataSection.DateTimeCombinations]: 'Date & Times',
  [DataSection.DayPeriods]: 'Day Periods',
  [DataSection.DaysOfWeek]: 'Days of the Week',
  [DataSection.DirectionExamples]: 'Direction Examples',
  [DataSection.Emojis]: 'Emojis',
  [DataSection.EraDateCombinations]: 'Era Dates',
  [DataSection.Eras]: 'Eras',
  [DataSection.FullTable]: 'Full Table',
  [DataSection.LanguageNames]: 'Language Names',
  [DataSection.Maths]: 'Maths',
  [DataSection.Months]: 'Months',
  [DataSection.Paragraphs]: 'Paragraphs',
  [DataSection.Quarters]: 'Quarters',
  [DataSection.Quotes]: 'Quotes',
  [DataSection.Regions]: 'Regions',
  [DataSection.RelativeTime]: 'Relative Time',
  [DataSection.Symbols]: 'Symbols',
  [DataSection.TechWords]: 'Tech Words',
  [DataSection.TimeCombinations]: 'Times',
  [DataSection.TimeIntervals]: 'Time Intervals',
  [DataSection.Timezones]: 'Time Zones',
};

function DataSectionLabel({ dataSection }: { dataSection: DataSection }) {
  return SECTION_LABELS[dataSection];
}

export default DataSectionLabel;

export function DataPageLabel({ dataPage }: { dataPage: DataPage }) {
  switch (dataPage) {
    case DataPage.Core:
      return 'Core';
    case DataPage.DateAndTime:
      return 'Date & Time';
    case DataPage.FullTable:
      return 'Full Table';
    case DataPage.Quantities:
      return 'Quantities';
    case DataPage.Translations:
      return 'Translations';
  }
}
