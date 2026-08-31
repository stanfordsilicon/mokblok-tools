import React from 'react';

import { DayKeys } from '@data/DayKeys';
import { useSourceDataContext } from '@data/source/SourceDataProvider';
import { useTargetDataContext } from '@data/target/TargetDataProvider';

import { useExampleDate } from '@settings/selectors/ExampleDateSelector';

import useInterfaceTranslation from '@shared/useInterfaceTranslation';

type DataPoint = {
  temp: number;
  emoji: string;
};

const weather: DataPoint[] = [
  { temp: -1, emoji: '❄️' },
  { temp: 3, emoji: '🌨️' },
  { temp: 6, emoji: '🌦️' },
  { temp: 10, emoji: '🌤️' },
  { temp: 14, emoji: '☀️' },
  { temp: 8, emoji: '🌧️' },
  { temp: 11, emoji: '⛈️' },
];

const DemoWeatherInWeek: React.FC = () => {
  const { uitext } = useInterfaceTranslation();
  const { findDataEntry } = useSourceDataContext();
  const { getTranslation } = useTargetDataContext();
  const today = useExampleDate();

  return (
    <>
      <text x={120} y={30} textAnchor="middle" fontSize="1.5em">
        {uitext('mocks.Weather')}
      </text>
      <g transform="translate(15,45)">
        {DayKeys?.map((day, index) => {
          const date = new Date(today);
          date.setDate(today.getDate() - today.getDay() + index); // Get the date for each day of the current week
          const isCurrentDay = index === today.getDay();

          return (
            <g key={index} transform={`translate(${index * 30 + 15},20)`} textAnchor="middle">
              {/* Day of Week */}
              <text fontWeight="bold">
                {getTranslation(findDataEntry({ field: 'E', length: 's', instance: day })) ?? ''}
              </text>

              {/* Day number */}
              <text y={30}>{date.getDate()}</text>

              {/* Rectangle background */}
              <rect
                key={index}
                x={-15}
                y={45}
                width={30}
                height={60}
                fill={isCurrentDay ? 'lightblue' : 'transparent'}
                stroke="#ccc"
              />

              {/* Temperature and emoji */}
              <text y={65}>{weather[index].temp}°</text>
              <text y={90}>{weather[index].emoji}</text>
            </g>
          );
        })}
      </g>
    </>
  );
};

export default DemoWeatherInWeek;
