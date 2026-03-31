import { DataType } from './DataTypes';

const DATA_TYPE_LABELS: Record<DataType, string> = {
  [DataType.Months]: 'Months',
  [DataType.DaysOfWeek]: 'Days of the Week',
  [DataType.DateFields]: 'Date Fields',
  [DataType.Alphabet]: 'Alphabet',
  [DataType.RelativeTime]: 'Relative Time',
  [DataType.TimeCombinations]: 'Time Combinations',
  [DataType.TimeIntervals]: 'Time Intervals',
  [DataType.DateCombinations]: 'Date Combinations',
  [DataType.Quarters]: 'Quarters',
  [DataType.Coordinates]: 'Coordinates',
  [DataType.DirectionExamples]: 'Direction Examples',
  [DataType.Eras]: 'Eras',
};

function DataTypeLabel({ dataType }: { dataType: DataType }) {
  return DATA_TYPE_LABELS[dataType];
}

export default DataTypeLabel;
