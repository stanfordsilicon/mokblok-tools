import React from 'react';

import { useDataContext } from '@data/DataContext';

import { useSettings } from '@settings/Settings';

import DemoID from './DemoID';
import DemoSVG from './DemoSVG';

const DemoDaysOfWeekInMonth: React.FC = () => {
  const { daysOfWeekData, monthsData } = useDataContext();
  const { today } = useSettings();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).getDay(); // Get the day of the week for the first day of the month (0-6, where 0 is Sunday)

  return (
    <DemoSVG id={DemoID.DaysOfWeekInMonth} width={240} height={240}>
      <path
        d="M10 -5 L5 0 L10 5"
        stroke="#ccc"
        fill="none"
        strokeWidth="2"
        transform="translate(20,25)"
      />
      <text x={120} y={30} textAnchor="middle" fontSize="1.2em">
        {monthsData[today.getMonth()]?.wide?.translated || ''}
      </text>
      <path
        d="M10 -5 L5 0 L10 5"
        stroke="#ccc"
        fill="none"
        strokeWidth="2"
        transform="translate(220,25) rotate(180) "
      />
      <g transform="translate(15,45)">
        {/* Days of week header */}
        {daysOfWeekData.map((day, index) => (
          <text key={index} x={index * 30 + 15} y={15} fontWeight="bold" textAnchor="middle">
            {day?.narrow?.translated || ''}
          </text>
        ))}
        {/* Calendar grid */}
        {[...Array(5)].map((_, weekIndex) => (
          <g key={weekIndex}>
            {[...Array(7)].map((_, dayIndex) => {
              const dayNumber = weekIndex * 7 + dayIndex - firstDayOfMonth + 1;
              const date = new Date(today.getFullYear(), today.getMonth(), dayNumber);
              const isCurrentMonth = date.getMonth() === today.getMonth();
              const isToday = date.getDate() === today.getDate() && isCurrentMonth;
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
    </DemoSVG>
  );
};

export default DemoDaysOfWeekInMonth;
