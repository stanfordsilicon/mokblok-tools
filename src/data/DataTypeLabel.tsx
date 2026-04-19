import { DataType } from './DataTypes';

const DATA_TYPE_LABELS: Record<DataType, string> = {
  [DataType.All]: 'Full List',
  [DataType.Alphabet]: 'Alphabet',
  [DataType.Coordinates]: 'Coordinates',
  [DataType.DateCombinations]: 'Dates',
  [DataType.DateFields]: 'Date Fields',
  [DataType.DateIntervals]: 'Date Intervals',
  [DataType.DateTimeCombinations]: 'Date & Times',
  [DataType.DayPeriods]: 'Day Periods',
  [DataType.DaysOfWeek]: 'Days of the Week',
  [DataType.DirectionExamples]: 'Direction Examples',
  [DataType.Emojis]: 'Emojis',
  [DataType.EraDateCombinations]: 'Era Dates',
  [DataType.Eras]: 'Eras',
  [DataType.Months]: 'Months',
  [DataType.Quarters]: 'Quarters',
  [DataType.Quotes]: 'Quotes',
  [DataType.RelativeTime]: 'Relative Time',
  [DataType.Symbols]: 'Symbols',
  [DataType.TimeCombinations]: 'Times',
  [DataType.TimeIntervals]: 'Time Intervals',
};

function DataTypeLabel({ dataType }: { dataType: DataType }) {
  return DATA_TYPE_LABELS[dataType];
}

export default DataTypeLabel;
