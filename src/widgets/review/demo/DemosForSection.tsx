import { DataSection } from '@data/DataSection';

import Demo from './Demo';
import DemoID from './DemoID';

const demoIDsBySection: Record<DataSection, DemoID[]> = {
  [DataSection.Alphabet]: [],
  [DataSection.CLDRTicket]: [],
  [DataSection.Coordinates]: [DemoID.CoordinatesMap, DemoID.CoordinatesDirections],
  [DataSection.DateCombinations]: [],
  [DataSection.DateIntervals]: [
    DemoID.DateInterval_InMonth_MEd,
    DemoID.DateInterval_InMonth_MMMd,
    DemoID.DateInterval_InMonth_MMMEd,
    DemoID.DateInterval_InMonth_yMMMd,
    DemoID.DateInterval_InMonth_yMMMEd,
  ],
  [DataSection.DateFields]: [DemoID.DateFieldBreakdown],
  [DataSection.DateTimeCombinations]: [],
  [DataSection.DayPeriods]: [],
  [DataSection.DaysOfWeek]: [DemoID.DaysOfWeekInWeek, DemoID.DaysOfWeekInMonth],
  [DataSection.DirectionExamples]: [DemoID.CoordinatesDirections],
  [DataSection.Emojis]: [DemoID.EmojiKeyboardSuggestions, DemoID.EmojiExplanations],
  [DataSection.Eras]: [DemoID.EraTimelineReligious, DemoID.EraTimelineSecular],
  [DataSection.EraDateCombinations]: [],
  [DataSection.LanguageNames]: [],
  [DataSection.Maths]: [],
  [DataSection.Months]: [DemoID.MonthsGrid, DemoID.MonthsTemp],
  [DataSection.Plurals]: [],
  [DataSection.Paragraphs]: [],
  [DataSection.Quarters]: [DemoID.QuartersCircle, DemoID.QuartersEvents],
  [DataSection.Quotes]: [],
  [DataSection.Regions]: [],
  [DataSection.RelativeTime]: [DemoID.RelativeTimeEventEnd],
  [DataSection.Symbols]: [],
  [DataSection.TechWords]: [],
  [DataSection.TimeCombinations]: [],
  [DataSection.TimeIntervals]: [
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
