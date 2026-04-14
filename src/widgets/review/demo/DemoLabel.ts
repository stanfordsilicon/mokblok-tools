import DemoID from './DemoID';

const demoLabelMap: Record<DemoID, string> = {
  [DemoID.MonthsGrid]: 'Months in a Grid',
  [DemoID.MonthsTemp]: 'Monthly Temperature',
  [DemoID.DaysOfWeekInMonth]: 'Days of Week (Month View)',
  [DemoID.DaysOfWeekInWeek]: 'Days of Week (Week View)',
  [DemoID.DateFieldBreakdown]: 'Date Field Breakdown',
  [DemoID.CoordinatesMap]: 'Location in Map',
  [DemoID.CoordinatesDirections]: 'Directions',
  [DemoID.QuartersCircle]: 'Quarters in a Circle',
  [DemoID.QuartersEvents]: 'Quarters in an Event View',
  [DemoID.DateIntervalCreateEvent]: 'Creating a Date Interval Event',
  [DemoID.TimeInterval24HourMin]: 'Time Interval (24-Hour Clock)',
  [DemoID.TimeInterval12HourMin]: 'Time Interval (12-Hour Clock)',
  [DemoID.TimeInterval24HourMinTimezone]: 'Time Interval (24-Hour Clock, with Timezone)',
  [DemoID.TimeInterval12HourMinTimezone]: 'Time Interval (12-Hour Clock, with Timezone)',
  [DemoID.TimeInterval24HourOnly]: 'Time Interval (24-Hour Clock, Hour Only)',
  [DemoID.TimeInterval12HourOnly]: 'Time Interval (12-Hour Clock, Hour Only)',
};

function DemoLabel({ demoID }: { demoID: DemoID }) {
  return demoLabelMap[demoID];
}

export default DemoLabel;
