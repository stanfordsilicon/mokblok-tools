import React from 'react';

import { useDataContext } from '@data/DataContext';

import { useSettings } from '@settings/Settings';

import DemoID from './DemoID';
import DemoSVG from './DemoSVG';

const DemoDaysOfWeekInWeek: React.FC = () => {
  const { daysOfWeekData, monthsData } = useDataContext();
  const { today } = useSettings();
  const currentMonth = today.getMonth(); // Current month (0-indexed)

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
        {monthsData[currentMonth]?.wide?.translated || ''}
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
            {day?.short?.translated || day?.short?.english || ''}
          </text>
        ))}
        {/* Day numbers */}
        {[...Array(7)].map((_, dayIndex) => {
          const date = new Date(today);
          date.setDate(today.getDate() - today.getDay() + dayIndex); // Get the date for each day of the current week
          return (
            <text key={dayIndex} x={dayIndex * 30 + 15} y={45} textAnchor="middle">
              {date.getDate()}
            </text>
          );
        })}
        {/* Rectangles for the 7 days of the week, with the current day highlighted */}
        {[...Array(7)].map((_, dayIndex) => {
          const isCurrentDay = dayIndex === today.getDay();
          return (
            <rect
              key={dayIndex}
              x={dayIndex * 30}
              y={60}
              width={30}
              height={120}
              fill={isCurrentDay ? 'lightblue' : 'transparent'}
              stroke="#ccc"
            />
          );
        })}
      </g>
    </DemoSVG>
  );
};

export default DemoDaysOfWeekInWeek;
