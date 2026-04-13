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
  [DemoID.TimeInterval24Hour]: 'Time Interval (24-Hour Clock)',
  [DemoID.TimeInterval12Hour]: 'Time Interval (12-Hour Clock)',
};

function DemoLabel({ demoID }: { demoID: DemoID }) {
  return demoLabelMap[demoID];
}

export default DemoLabel;
