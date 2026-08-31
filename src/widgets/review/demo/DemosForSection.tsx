import { DataSection } from '@data/DataSection';

import Demo from './Demo';
import DemoID from './DemoID';

const demoIDsBySection: Record<DataSection, DemoID[]> = {
  [DataSection.All]: [],
  [DataSection.Alphabet]: [],
  [DataSection.CLDRTicket]: [],
  [DataSection.Coordinates]: [DemoID.CoordinatesMap, DemoID.CoordinatesDirections],
  [DataSection.Dates]: [],
  [DataSection.DateIntervals]: [
    DemoID.DateInterval_InMonth_MEd,
    DemoID.DateInterval_InMonth_MMMd,
    DemoID.DateInterval_InMonth_MMMEd,
    DemoID.DateInterval_InMonth_yMMMd,
    DemoID.DateInterval_InMonth_yMMMEd,
  ],
  [DataSection.DateFields]: [DemoID.DateFieldBreakdown],
  [DataSection.DateTimes]: [],
  [DataSection.DayPeriods]: [],
  [DataSection.DaysOfWeek]: [
    // DemoID.DaysOfWeekInWeek,
    DemoID.DaysOfWeekInMonth,
    DemoID.WeatherInWeek,
    DemoID.ClassesThisWeek,
    DemoID.ClassesThisWeekend,
  ],
  [DataSection.DirectionExamples]: [DemoID.CoordinatesDirections],
  [DataSection.Emoji]: [DemoID.EmojiKeyboardSuggestions, DemoID.EmojiExplanations],
  [DataSection.Eras]: [DemoID.EraTimelineReligious, DemoID.EraTimelineSecular],
  [DataSection.EraDates]: [],
  [DataSection.LanguageNames]: [],
  [DataSection.Maths]: [],
  [DataSection.Months]: [DemoID.MonthsGrid, DemoID.MonthsTemp],
  [DataSection.Plurals]: [],
  [DataSection.Paragraphs]: [],
  [DataSection.Quarters]: [DemoID.QuartersCircle, DemoID.QuartersEvents],
  [DataSection.Quotes]: [],
  [DataSection.Regions]: [],
  [DataSection.RelativeTime]: [DemoID.RelativeTimeEventEnd, DemoID.ClassesThisWeek],
  [DataSection.Symbols]: [],
  [DataSection.TechWords]: [],
  [DataSection.Times]: [],
  [DataSection.TimeIntervals]: [
    DemoID.ClassesThisWeek,
    DemoID.ClassesThisWeekend,
    DemoID.TimeInterval24HourMin,
    DemoID.TimeInterval12HourMin,
    DemoID.TimeInterval24HourMinTimezone,
    DemoID.TimeInterval12HourMinTimezone,
    DemoID.TimeInterval24HourOnly,
    DemoID.TimeInterval12HourOnly,
  ],
  [DataSection.Timezones]: [],
  [DataSection.FullTable]: [],
};

const DemosForSection: React.FC<{ dataSection: DataSection }> = ({ dataSection }) => {
  return demoIDsBySection[dataSection].map((demoID) => <Demo demoID={demoID} key={demoID} />);
};

export default DemosForSection;
