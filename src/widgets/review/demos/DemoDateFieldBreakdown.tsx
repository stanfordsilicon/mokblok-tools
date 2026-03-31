import React, { useCallback } from 'react';

import { useDataContext } from '@data/DataContext';
import { DateField } from '@data/DataTypes';

import { useSettings } from '@settings/Settings';

import { getSourceLanguageData } from '../getSourceLanguageData';

import DemoID from './DemoID';
import DemoSVG from './DemoSVG';

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
  const { dateFields, months, daysOfWeek, relativeTime } = useDataContext().data;
  const { today } = useSettings();

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
          return months?.[today.getMonth()].wide?.translated ?? ''; // Months are 0-indexed
        case DateField.Week:
          return ''; // Not useful in this display
        case DateField.Day:
          return today.getDate();
        case DateField.DayOfWeek:
          return daysOfWeek?.[today.getDay()].wide?.translated ?? ''; // Sunday = 0, Monday = 1, ..., Saturday = 6
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
    [today, months, daysOfWeek],
  );

  const todayData = relativeTime?.day?.['0'];

  return (
    <DemoSVG id={DemoID.DateFieldBreakdown} width={240} height={240}>
      <text x={120} y={30} textAnchor="middle" fontSize="1.2em">
        {todayData?.translated || getSourceLanguageData(todayData) || 'Today'}
      </text>
      {ShownDateFields.map((fieldKey, index) => {
        const fieldData = dateFields?.[fieldKey];
        const x = 120;
        const y = index * 20 + 75;
        return (
          <g key={index} transform={`translate(${x},${y})`}>
            <text x={-20} textAnchor="end">
              {fieldData?.wide?.translated || fieldData?.wide?.english || ''}
            </text>
            <text x={20}>{getTodayFieldValue(fieldKey)}</text>
          </g>
        );
      })}
    </DemoSVG>
  );
};

export default DemoDateFieldBreakdown;
