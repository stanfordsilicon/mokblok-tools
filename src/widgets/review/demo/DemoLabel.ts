import DemoID from './DemoID';

const demoLabelMap: Record<DemoID, string> = {
  [DemoID.CoordinatesDirections]: 'Directions',
  [DemoID.CoordinatesMap]: 'Location in Map',
  [DemoID.DateFieldBreakdown]: 'Date Field Breakdown',
  [DemoID.DateInterval_InMonth_MEd]: 'Date Interval (in Month, MEd)',
  [DemoID.DateInterval_InMonth_MMMd]: 'Date Interval (in Month, MMMd)',
  [DemoID.DateInterval_InMonth_MMMEd]: 'Date Interval (in Month, MMMEd)',
  [DemoID.DateInterval_InMonth_yMMMd]: 'Date Interval (in Month, yMMMd)',
  [DemoID.DateInterval_InMonth_yMMMEd]: 'Date Interval (in Month, yMMMEd)',
  [DemoID.DaysOfWeekInMonth]: 'Days of Week (Month View)',
  [DemoID.DaysOfWeekInWeek]: 'Days of Week (Week View)',
  [DemoID.MonthsGrid]: 'Months in a Grid',
  [DemoID.MonthsTemp]: 'Monthly Temperature',
  [DemoID.QuartersCircle]: 'Quarters in a Circle',
  [DemoID.QuartersEvents]: 'Quarters in an Event View',
  [DemoID.TimeInterval12HourMin]: 'Time Interval (12-Hour Clock)',
  [DemoID.TimeInterval12HourMinTimezone]: 'Time Interval (12-Hour Clock, with Timezone)',
  [DemoID.TimeInterval12HourOnly]: 'Time Interval (12-Hour Clock, Hour Only)',
  [DemoID.TimeInterval24HourMin]: 'Time Interval (24-Hour Clock)',
  [DemoID.TimeInterval24HourMinTimezone]: 'Time Interval (24-Hour Clock, with Timezone)',
  [DemoID.TimeInterval24HourOnly]: 'Time Interval (24-Hour Clock, Hour Only)',
};

function DemoLabel({ demoID }: { demoID: DemoID }) {
  return demoLabelMap[demoID];
}

export default DemoLabel;
