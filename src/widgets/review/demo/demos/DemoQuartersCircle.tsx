import React from 'react';

import { useSourceDataContext } from '@data/source/SourceDataProvider';
import { useTargetDataContext } from '@data/target/TargetDataProvider';

import { useExampleDate } from '@settings/selectors/ExampleDateSelector';

const DemoQuartersCircle: React.FC = () => {
  const { findDataEntry } = useSourceDataContext();
  const { getTranslation } = useTargetDataContext();

  const today = useExampleDate();
  const months = [...Array(12)]
    .map((_, index) => findDataEntry({ field: 'M', instance: (index + 1).toString(), length: 'a' }))
    .filter((m) => m != null);
  const quarters = [...Array(4)]
    .map((_, index) =>
      findDataEntry({ field: 'q', instance: (index + 1).toString(), length: 'a', variant: 's' }),
    )
    .filter((q) => q != null);
  const currentMonth = today.getMonth(); // Current month (0-indexed)
  const yearStart = new Date(today.getFullYear(), 0, 0);
  const diff =
    today.valueOf() -
    yearStart.valueOf() +
    (yearStart.getTimezoneOffset() - today.getTimezoneOffset()) * 60 * 1000;
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);

  return (
    <>
      {/* Outer circle for quarters */}
      <circle cx={120} cy={120} r={110} fill="#f9f9f9" stroke="#ccc" />
      {/* Quarter lines */}
      <line x1={120} y1={10} x2={120} y2={230} stroke="#ccc" />
      <line x1={10} y1={120} x2={230} y2={120} stroke="#ccc" />

      {/* Inner circle for months */}
      <circle cx={120} cy={120} r={80} fill="#e0e0e0" />

      {/* Lines for each month */}
      {[...Array(12)].map((_, monthIndex) => (
        <line
          key={monthIndex}
          x1={120}
          y1={120}
          x2={120 + 80 * Math.cos((monthIndex / 12) * 2 * Math.PI - Math.PI / 2)}
          y2={120 + 80 * Math.sin((monthIndex / 12) * 2 * Math.PI - Math.PI / 2)}
          stroke="#ccc"
        />
      ))}

      {/* Line for current date */}
      <line
        x1={120}
        y1={120}
        x2={120 + 40 * Math.cos((dayOfYear / 365) * 2 * Math.PI - Math.PI / 2)}
        y2={120 + 40 * Math.sin((dayOfYear / 365) * 2 * Math.PI - Math.PI / 2)}
        stroke="blue"
        strokeWidth={3}
      />

      {/* Color the wedge for the current quarter */}
      <path
        d={`M120,120 L${120 + 110 * Math.cos((currentMonth / 12) * 2 * Math.PI - Math.PI / 2)} ${
          120 + 110 * Math.sin((currentMonth / 12) * 2 * Math.PI - Math.PI / 2)
        } A100,100 0 ${
          currentMonth >= 6 ? 1 : 0
        },1 ${120 + 110 * Math.cos(((currentMonth + 1) / 12) * 2 * Math.PI - Math.PI / 2)} ${
          120 + 110 * Math.sin(((currentMonth + 1) / 12) * 2 * Math.PI - Math.PI / 2)
        } Z`}
        fill="rgba(0,0,255,0.1)"
      />

      {/* Quarter labels */}
      {[0, 1, 2, 3].map((quarter) => (
        <text
          key={quarter}
          x={120 + 95 * Math.cos(((quarter + 0.5) / 4) * 2 * Math.PI - Math.PI / 2)}
          y={120 + 95 * Math.sin(((quarter + 0.5) / 4) * 2 * Math.PI - Math.PI / 2)}
          textAnchor="middle"
          alignmentBaseline="middle"
          fontSize="1em"
        >
          {getTranslation(quarters[quarter]) || ''}
        </text>
      ))}

      {/* Month Labels */}
      {[...Array(12)].map((_, monthIndex) => (
        <text
          key={monthIndex}
          x={120 + 60 * Math.cos((monthIndex / 12) * 2 * Math.PI - (Math.PI * 13) / 32)}
          y={120 + 60 * Math.sin((monthIndex / 12) * 2 * Math.PI - (Math.PI * 13) / 32)}
          textAnchor="middle"
          alignmentBaseline="middle"
          fontSize="0.75em"
        >
          {getTranslation(months[monthIndex]) || ''}
        </text>
      ))}
    </>
  );
};

export default DemoQuartersCircle;
