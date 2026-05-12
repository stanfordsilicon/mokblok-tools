export enum DataPage {
  Core = 'core',
  DateAndTime = 'dateAndTime',
  Quantities = 'quantities',
  Translations = 'translations',
  FullTable = 'fullTable', // basic view of all data, for quick browsing and searching
}

// Order this by order of appearance
export enum DataSection {
  Alphabet = 'alphabet',
  Symbols = 'symbols',
  Quotes = 'quotes',
  Maths = 'maths',
  Plurals = 'plurals',

  // Date and time
  DateFields = 'dateFields',
  DayPeriods = 'dayPeriods',
  DaysOfWeek = 'daysOfWeek',
  Months = 'months',
  Quarters = 'quarters',
  Eras = 'eras',

  RelativeTime = 'relativeTime',
  TimeCombinations = 'timeCombinations',
  TimeIntervals = 'timeIntervals',
  DateCombinations = 'dateCombinations',
  DateIntervals = 'dateIntervals',
  DateTimeCombinations = 'dateTimeCombinations',
  EraDateCombinations = 'eraDateCombinations',

  // Quantities
  Coordinates = 'coordinates',
  DirectionExamples = 'directionExamples',

  // Translations
  LanguageNames = 'languageNames',
  Regions = 'regions',
  Timezones = 'timezones',
  Emojis = 'emojis',
  TechWords = 'techWords',
  Paragraphs = 'paragraphs',
  CLDRTicket = 'cldrTicket',

  // Full Table
  FullTable = 'fullTable',
}

export function getSectionsForPage(page: DataPage): DataSection[] {
  switch (page) {
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
        DataSection.Quarters,
        DataSection.Eras,
        DataSection.RelativeTime,
        DataSection.TimeCombinations,
        DataSection.TimeIntervals,
        DataSection.DateCombinations,
        DataSection.DateIntervals,
        DataSection.DateTimeCombinations,
        DataSection.EraDateCombinations,
      ];
    case DataPage.Quantities:
      return [DataSection.Coordinates, DataSection.DirectionExamples];
    case DataPage.Translations:
      return [
        DataSection.LanguageNames,
        DataSection.Regions,
        DataSection.Timezones,
        DataSection.Emojis,
        DataSection.TechWords,
        DataSection.Paragraphs,
        DataSection.CLDRTicket,
      ];
    case DataPage.FullTable:
      return [DataSection.FullTable];
  }
}
