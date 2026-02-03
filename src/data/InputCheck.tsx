import type React from 'react';
import { useDataContext } from './DataContext';

const InputCheck: React.FC<{ numRows: number }> = ({ numRows }) => {
  const { monthsData, daysOfWeekData, dateFieldsData } = useDataContext();
  return (
    <div>
      <strong>Total rows loaded:</strong> {numRows}
      <br />
      <strong>Months loaded:</strong>{' '}
      {monthsData.reduce(
        (count, month) =>
          count + ((month.wide ? 1 : 0) + (month.abbreviated ? 1 : 0) + (month.narrow ? 1 : 0)),
        0,
      )}{' '}
      / 36 (12 months × 3 forms)
      <br />
      <strong>Days of the week loaded:</strong>{' '}
      {daysOfWeekData.reduce(
        (count, day) =>
          count +
          ((day.wide ? 1 : 0) +
            (day.abbreviated ? 1 : 0) +
            (day.short ? 1 : 0) +
            (day.narrow ? 1 : 0)),
        0,
      )}{' '}
      / 28 (7 days × 4 forms)
      <br />
      <strong>Date fields loaded:</strong>{' '}
      {Object.values(dateFieldsData).reduce(
        (count, field) =>
          count + ((field.wide ? 1 : 0) + (field.short ? 1 : 0) + (field.narrow ? 1 : 0)),
        0,
      )}{' '}
      / 23 (10 fields × 1-3 forms each)
    </div>
  );
};

export default InputCheck;
