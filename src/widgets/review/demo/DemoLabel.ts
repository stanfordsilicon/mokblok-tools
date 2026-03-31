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
};

function DemoLabel({ demoID }: { demoID: DemoID }) {
  return demoLabelMap[demoID];
}

export default DemoLabel;
