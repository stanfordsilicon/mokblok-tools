import React from 'react';

import { useDataContext } from '@data/DataContext';
import type { DataField } from '@data/DataTypes';
import { DayKeys } from '@data/DayKeys';

type Props = {
  query: Partial<DataField>;
};

const DemoMonthlyCalendar: React.FC<Props> = ({ query }) => {
  const { findDataField, getTranslation } = useDataContext();
  const dataField = findDataField(query)!;
  const firstDate = new Date(dataField?.var1 ?? 0);
  const endDate = dataField?.var2 ? new Date(dataField.var2) : new Date(firstDate);
  const firstDayOfMonth = new Date(firstDate.getFullYear(), firstDate.getMonth(), 1).getDay(); // Get the day of the week for the first day of the month (0-6, where 0 is Sunday)

  return (
    <>
      <text x={120} y={30} textAnchor="middle" fontSize="1.2em">
        {getTranslation(dataField) ?? ''}
      </text>
      <g transform="translate(15,45)">
        {/* Days of week header */}
        {DayKeys?.map((day, index) => (
          <text key={index} x={index * 30 + 15} y={15} fontWeight="bold" textAnchor="middle">
            {getTranslation(findDataField({ field: 'E', length: 'n', instance: day })) ?? ''}
          </text>
        ))}
        {/* Calendar grid */}
        {[...Array(5)].map((_, weekIndex) => (
          <g key={weekIndex}>
            {[...Array(7)].map((_, dayIndex) => {
              const dayNumber = weekIndex * 7 + dayIndex - firstDayOfMonth + 1;
              const date = new Date(firstDate.getFullYear(), firstDate.getMonth(), dayNumber);
              const isCurrentMonth = date.getMonth() === firstDate.getMonth();
              const isToday =
                date.getDate() >= firstDate.getDate() &&
                date.getDate() <= endDate.getDate() &&
                isCurrentMonth;
              return (
                <g key={dayIndex} transform={`translate(${dayIndex * 30},${weekIndex * 30 + 30})`}>
                  <rect
                    width={30}
                    height={30}
                    fill={isToday ? 'lightblue' : 'transparent'}
                    stroke="#ccc"
                  />
                  <text
                    x={15}
                    y={15}
                    fill={isCurrentMonth ? 'black' : 'lightgray'}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    {date.getDate()}
                  </text>
                </g>
              );
            })}
          </g>
        ))}
      </g>
    </>
  );
};

export default DemoMonthlyCalendar;
