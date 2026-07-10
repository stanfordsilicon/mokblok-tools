import React, { useCallback } from 'react';

import { useDataContext } from '@data/DataContext';
import { DateField } from '@data/DateField';
import { DayKeys } from '@data/DayKeys';

import { getExampleDate } from '@settings/selectors/ExampleDateSelector';

const ShownDateFields: DateField[] = [
  //   DateField.Era,
  DateField.Year,
  //   DateField.Quarter,
  DateField.Month,
  //   DateField.Week,
  DateField.Day,
  DateField.DayOfWeek,
  DateField.Hour,
  DateField.Minute,
  DateField.Second,
];

const DemoDateFieldBreakdown: React.FC = () => {
  const today = getExampleDate();
  const { getTranslation, findDataEntry } = useDataContext();

  const getTodayFieldValue = useCallback(
    (fieldKey: DateField): string | number => {
      switch (fieldKey) {
        case DateField.Era:
          return today.getFullYear() >= 0 ? 'AD' : 'BC';
        case DateField.Year:
          return today.getFullYear();
        case DateField.Quarter:
          return Math.floor(today.getMonth() / 3) + 1; // Quarters are 1-indexed
        case DateField.Month:
          return (
            getTranslation(
              findDataEntry({ field: 'M', instance: String(today.getMonth() + 1), length: 'w' }),
            ) || ''
          ); // Months are 0-indexed
        // return months?.[today.getMonth()].wide?.translated ?? ''; // Months are 0-indexed
        case DateField.Week:
          return ''; // Not useful in this display
        case DateField.Day:
          return today.getDate();
        case DateField.DayOfWeek:
          return (
            getTranslation(
              findDataEntry({ field: 'E', instance: DayKeys[today.getDay()], length: 'w' }),
            ) || ''
          );
        case DateField.Hour:
          return today.getHours();
        case DateField.Minute:
          return today.getMinutes();
        case DateField.Second:
          return today.getSeconds();
        default:
          return '';
      }
    },
    [today, getTranslation, findDataEntry],
  );

  return (
    <>
      <text x={120} y={30} textAnchor="middle" fontSize="1.2em">
        {getTranslation(findDataEntry({ field: 'd', instance: '0' })) ?? ''}
      </text>
      {ShownDateFields.map((fieldKey, index) => {
        const fieldData = findDataEntry({ field: fieldKey, length: 'w' });
        const x = 120;
        const y = index * 20 + 75;
        return (
          <g key={index} transform={`translate(${x},${y})`}>
            <text x={-10} textAnchor="end">
              {getTranslation(fieldData) ?? ''}
            </text>
            <text x={10}>{getTodayFieldValue(fieldKey)}</text>
          </g>
        );
      })}
    </>
  );
};

export default DemoDateFieldBreakdown;
