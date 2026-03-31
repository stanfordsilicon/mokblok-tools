import { DataType } from '@data/DataTypes';

import Demo from './Demo';
import DemoID from './DemoID';

const demoIDsByDataType: Record<DataType, DemoID[]> = {
  [DataType.Alphabet]: [],
  [DataType.Coordinates]: [DemoID.CoordinatesMap],
  [DataType.DateCombinations]: [],
  [DataType.DateFields]: [DemoID.DateFieldBreakdown],
  [DataType.DaysOfWeek]: [DemoID.DaysOfWeekInWeek, DemoID.DaysOfWeekInMonth],
  [DataType.DirectionExamples]: [DemoID.CoordinatesDirections],
  [DataType.Eras]: [],
  [DataType.Months]: [DemoID.MonthsGrid, DemoID.MonthsTemp],
  [DataType.Quarters]: [DemoID.QuartersCircle, DemoID.QuartersEvents],
  [DataType.RelativeTime]: [],
  [DataType.TimeCombinations]: [],
  [DataType.TimeIntervals]: [],
};

const DemosForDataType: React.FC<{ dataType: DataType }> = ({ dataType }) => {
  return demoIDsByDataType[dataType].map((demoID) => <Demo demoID={demoID} key={demoID} />);
};

export default DemosForDataType;
