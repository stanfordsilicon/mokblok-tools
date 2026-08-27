export enum DataPage {
  All = 'All',
  Core = 'Core',
  DateAndTime = 'DateAndTime',
  Quantities = 'Quantities',
  Translations = 'Translations',
  FullTable = 'FullTable', // basic view of all data, for quick browsing and searching
}

// Order this by order of appearance
export enum DataSection {
  All = 'All',

  Alphabet = 'Alphabet',
  Symbols = 'Symbols',
  Quotes = 'Quotes',
  Maths = 'Maths',
  Plurals = 'Plurals',

  // Date and time
  DateFields = 'DateFields',
  DayPeriods = 'DayPeriods',
  DaysOfWeek = 'DaysOfWeek',
  Months = 'Months',
  Quarters = 'Quarters',
  Eras = 'Eras',

  RelativeTime = 'RelativeTime',
  Times = 'Times',
  TimeIntervals = 'TimeIntervals',
  Dates = 'Dates',
  DateIntervals = 'DateIntervals',
  DateTimes = 'DateTimes',
  EraDates = 'EraDates',

  // Quantities
  Coordinates = 'Coordinates',
  DirectionExamples = 'DirectionExamples',

  // Translations
  LanguageNames = 'LanguageNames',
  Regions = 'Regions',
  Timezones = 'Timezones',
  Emoji = 'Emoji',
  TechWords = 'TechWords',
  Paragraphs = 'Paragraphs',
  CLDRTicket = 'CLDRTicket',

  // Full Table
  FullTable = 'FullTable',
}

export function getSectionsForPage(page: DataPage): DataSection[] {
  switch (page) {
    case DataPage.All:
      return Object.values(DataSection).filter(
        (section) => section !== DataSection.All && section !== DataSection.FullTable,
      );
    case DataPage.Core:
      return [
        DataSection.Alphabet,
        DataSection.Symbols,
        DataSection.Quotes,
        DataSection.Maths,
        DataSection.Plurals,
      ];
    case DataPage.DateAndTime:
      return [
        DataSection.DateFields,
        DataSection.DayPeriods,
        DataSection.DaysOfWeek,
        DataSection.Months,
        DataSection.RelativeTime,
        DataSection.Times,
        DataSection.TimeIntervals,
        DataSection.Dates,
        DataSection.DateIntervals,
        DataSection.DateTimes,
        DataSection.Quarters,
        DataSection.Eras,
        DataSection.EraDates,
      ];
    case DataPage.Quantities:
      return [DataSection.Coordinates, DataSection.DirectionExamples];
    case DataPage.Translations:
      return [
        DataSection.LanguageNames,
        DataSection.Regions,
        DataSection.Timezones,
        DataSection.Emoji,
        DataSection.TechWords,
        DataSection.Paragraphs,
        DataSection.CLDRTicket,
      ];
    case DataPage.FullTable:
      return [DataSection.FullTable];
  }
}
