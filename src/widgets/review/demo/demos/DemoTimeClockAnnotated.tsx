import React from 'react';

import { useSourceDataContext } from '@data/source/SourceDataProvider';
import { useTargetTranslationLookup } from '@data/target/useTargetTranslation';

import { useURLParams } from '@settings/URLParams';

type Props = {
  period: 'morning' | 'afternoon' | 'evening' | 'midnight';
};

const DemoTimeClockAnnotated: React.FC<Props> = ({ period }) => {
  const { findDataEntry } = useSourceDataContext();
  const getTranslation = useTargetTranslationLookup();
  const { targetLanguage } = useURLParams();
  const ampm = period === 'morning' || period === 'midnight' ? 'AM' : 'PM';
  const ampmEntry = findDataEntry({ instance: ampm.toLowerCase() });
  const timeEntry = findDataEntry({
    instance: period === 'midnight' ? period : period + '1',
    variant: period === 'midnight' ? 's' : 'f',
    exampleNum: period === 'midnight' ? '0' : '1',
  });

  function getX(hour: number, radius: number) {
    return 120 + radius * Math.cos(((hour % 12) / 12) * 2 * Math.PI - Math.PI / 2);
  }
  function getY(hour: number, radius: number) {
    return 120 + radius * Math.sin(((hour % 12) / 12) * 2 * Math.PI - Math.PI / 2);
  }

  return (
    <>
      <rect x={10} y={10} width={220} height={40} fill="#ddd" stroke="#ccc" rx="10" ry="10" />
      <text x={120} y={35} fontSize="1.2em" style={{ textAnchor: 'middle' }}>
        {getTranslation(timeEntry)}
      </text>
      <text x={30} y={210} fontSize="1.2em" style={{ textAnchor: 'middle' }}>
        {getTranslation(ampmEntry)}
      </text>

      <g transform={`translate(0, 20)`}>
        {/* Quarter lines */}

        {/* Inner circle for months */}
        <circle cx={120} cy={120} r={80} fill="#eee" />

        {/* Tick marks for each month */}
        {[...Array(12)].map((_, hour) => (
          <line
            key={hour}
            x1={getX(hour, 70)}
            y1={getY(hour, 70)}
            x2={getX(hour, 80)}
            y2={getY(hour, 80)}
            stroke="#ccc"
          />
        ))}

        {/* Minor Ticks */}
        {/* Tick marks for each month */}
        {[...Array(60)].map((_, t) => (
          <line
            key={t}
            x1={getX(t / 5, 75)}
            y1={getY(t / 5, 75)}
            x2={getX(t / 5, 80)}
            y2={getY(t / 5, 80)}
            stroke="#ddd"
          />
        ))}

        {/* Line for current hour */}
        <line
          x1={120}
          y1={120}
          x2={getX(timeEntry?.var1 ?? 0, 30)}
          y2={getY(timeEntry?.var1 ?? 0, 30)}
          stroke="blue"
          strokeWidth={3}
        />

        {/* Line for current minute */}
        <line x1={120} y1={120} x2={getX(0, 50)} y2={getY(0, 50)} stroke="blue" strokeWidth={2} />

        {/* Time Labels */}
        {[...Array(12)].map((_, hour) => (
          <text
            key={hour}
            x={getX(hour, 60)}
            y={getY(hour, 60)}
            textAnchor="middle"
            alignmentBaseline="middle"
            fontSize="0.75em"
          >
            {(hour || 12).toLocaleString(targetLanguage) || ''}
          </text>
        ))}
      </g>
    </>
  );
};

export default DemoTimeClockAnnotated;
