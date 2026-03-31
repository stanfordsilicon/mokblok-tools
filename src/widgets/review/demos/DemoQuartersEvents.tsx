import React from 'react';

import { useDataContext } from '@data/DataContext';
import { FormatLength, SentenceContext } from '@data/DataTypes';

import DemoID from './DemoID';
import DemoSVG from './DemoSVG';

const DemoQuartersEvents: React.FC = () => {
  const { quartersData } = useDataContext();
  // Example events for each quarter
  const events = [['🎉🎂'], ['🎓', '👰🤵'], ['🚜🎪'], ['🎿🏔', '👩🎂', '🎁']];

  return (
    <DemoSVG id={DemoID.QuartersEvents} width={240} height={240}>
      {/* Box at top that says "upcoming events" */}
      <rect x={10} y={10} width={220} height={30} fill="#f0f0f0" stroke="#ccc" />
      <text x={120} y={30} textAnchor="middle" fontSize="1em" fontWeight="bold">
        Upcoming Events
      </text>

      {/* Rectangles for the 4 quarters */}
      {[...Array(4)].map((_, quarter) => (
        <g key={quarter} style={{ transform: `translate(20px, ${50 + quarter * 45}px)` }}>
          <text y={10} textAnchor="start" alignmentBaseline="middle" fontSize="1em">
            {quartersData?.[SentenceContext.InSentence][quarter][FormatLength.Wide]?.translated}
          </text>

          {/* events as small boxes below the quarter names */}
          {[...Array(4)].map(
            (_, eventIndex) =>
              events[quarter][eventIndex] && (
                <g key={eventIndex} style={{ transform: `translate(${eventIndex * 50}px, 20px)` }}>
                  <rect key={eventIndex} width={40} height={20} fill="#e0e0e0" stroke="#ccc" />
                  <text
                    x={20}
                    y={10}
                    textAnchor="middle"
                    alignmentBaseline="middle"
                    fontSize="0.8em"
                  >
                    {events[quarter][eventIndex] || ''}
                  </text>
                </g>
              ),
          )}
        </g>
      ))}
    </DemoSVG>
  );
};

export default DemoQuartersEvents;
