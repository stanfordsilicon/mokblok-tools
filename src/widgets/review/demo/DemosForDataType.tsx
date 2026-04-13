import { DataType } from '@data/DataTypes';

import Demo from './Demo';
import DemoID from './DemoID';

const demoIDsByDataType: Record<DataType, DemoID[]> = {
  [DataType.Alphabet]: [],
  [DataType.Coordinates]: [DemoID.CoordinatesMap, DemoID.CoordinatesDirections],
  [DataType.DateCombinations]: [],
  [DataType.DateIntervals]: [DemoID.DateIntervalCreateEvent],
  [DataType.DateFields]: [DemoID.DateFieldBreakdown],
  [DataType.DaysOfWeek]: [DemoID.DaysOfWeekInWeek, DemoID.DaysOfWeekInMonth],
  [DataType.DirectionExamples]: [DemoID.CoordinatesDirections],
  [DataType.Eras]: [],
  [DataType.EraDateCombinations]: [],
  [DataType.Months]: [DemoID.MonthsGrid, DemoID.MonthsTemp],
  [DataType.Quarters]: [DemoID.QuartersCircle, DemoID.QuartersEvents],
  [DataType.RelativeTime]: [],
  [DataType.TimeCombinations]: [],
  [DataType.TimeIntervals]: [DemoID.TimeInterval24Hour, DemoID.TimeInterval12Hour],
  [DataType.All]: [],
};

const DemosForDataType: React.FC<{ dataType: DataType }> = ({ dataType }) => {
  return demoIDsByDataType[dataType].map((demoID) => <Demo demoID={demoID} key={demoID} />);
};

export default DemosForDataType;
