import React from 'react';

import { DataSection } from '@data/DataSection';
import { DayKeys } from '@data/DayKeys';
import { useSourceDataContext } from '@data/source/SourceDataProvider';
import { useTargetDataContext } from '@data/target/TargetDataProvider';

// all: field: intervalFormats, instance:h
// const CLASSES: Record<string, Partial<DataEntry>[]> = {
//   'sun': [{instance:'h', variant:'a', }],
//   'mon': [],
//   'tue': [],
//   'wed': [],
//   'thu': [],
//   'fri': [],
//   'sat': [],
// };

const CLASSES: Record<string, string> = {
  mon: 'a',
  tue: 'h',
  wed: 'a',
  thu: 'h',
  fri: 'a',
};

const DemoClassesThisWeek: React.FC<{ period: 'week' | 'weekend' }> = ({ period }) => {
  const { findDataEntry, findDataEntries } = useSourceDataContext();
  const { getTranslation } = useTargetDataContext();
  const days = period == 'week' ? DayKeys.slice(1, 5) : [...DayKeys.slice(5, 7), DayKeys[0]];

  return (
    <>
      {/* Box at top that says "upcoming events" */}
      <rect x={10} y={10} width={220} height={30} fill="#f0f0f0" stroke="#ccc" />
      <text x={120} y={30} textAnchor="middle" fontSize="1em" fontWeight="bold">
        {getTranslation(
          findDataEntry({
            section: DataSection.RelativeTime,
            field: 'd',
            instance: '0',
            length: '',
          }),
        ) ?? ''}
      </text>

      {/* Rectangles for the 4 quarters */}
      {days.map((day, index) => {
        const variant = CLASSES[day];
        const intervals = findDataEntries({
          field: 'intervalFormats',
          instance: 'h',
          variant,
        }).sort((a, b) => (a.var1 ?? 0) - (b.var1 ?? 0));
        if (variant === 'a') intervals.pop();

        return (
          <g key={day} style={{ transform: `translate(20px, ${50 + index * 45}px)` }}>
            <text y={10} textAnchor="start" alignmentBaseline="middle" fontSize="1em">
              {getTranslation(findDataEntry({ field: 'E', length: 'w', instance: day })) ?? ''}
            </text>

            {/* events as small boxes below the quarter names */}
            {intervals.map((interval, index) => (
              <g key={index} style={{ transform: `translate(${index * 70}px, 20px)` }}>
                <rect
                  key={index}
                  width={60 + (variant === 'a' ? 40 : 0)}
                  height={20}
                  rx={5}
                  ry={5}
                  fill="#eee"
                  stroke="#ccc"
                />
                <text
                  x={30 + (variant === 'a' ? 20 : 0)}
                  y={10}
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  fontSize="0.8em"
                >
                  {getTranslation(interval) ?? ''}
                </text>
              </g>
            ))}

            {intervals.length === 0 && (
              <g style={{ transform: `translate(0, 20px)` }}>
                <rect key={index} width={40} height={20} rx={5} ry={5} fill="#eee" stroke="#ccc" />
                <text x={20} y={10} textAnchor="middle" alignmentBaseline="middle" fontSize="0.8em">
                  🌞
                </text>
              </g>
            )}
          </g>
        );
      })}
    </>
  );
};

export default DemoClassesThisWeek;
