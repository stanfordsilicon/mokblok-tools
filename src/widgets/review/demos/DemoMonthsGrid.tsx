import React from 'react';

import { useDataContext } from '@data/DataContext';

import { useSettings } from '@settings/Settings';

import DemoID from './DemoID';
import DemoSVG from './DemoSVG';

const DemoMonthsGrid: React.FC = () => {
  const { monthsData } = useDataContext();
  const { today } = useSettings();

  return (
    <DemoSVG id={DemoID.MonthsGrid} width={250} height={250}>
      <rect x="10" y="10" width="230" height="230" fill="white" rx="10" ry="10" />
      <path
        d="M10 -5 L5 0 L10 5"
        stroke="#ccc"
        fill="none"
        strokeWidth="2"
        transform="translate(30,40)"
      />
      <text x="125" y="40" textAnchor="middle" dominantBaseline="middle" fontSize="1.2em">
        {today.getFullYear()}
      </text>
      <path
        d="M10 -5 L5 0 L10 5"
        stroke="#ccc"
        fill="none"
        strokeWidth="2"
        transform="translate(220,40) rotate(180) "
      />
      {monthsData.map((month, index) => {
        const x = (index % 4) * 55 + 40;
        const y = Math.floor(index / 4) * 60 + 90;
        return (
          <g key={index} transform={`translate(${x},${y})`}>
            <rect
              x={-20}
              y={-20}
              width={40}
              height={40}
              fill={index === today.getMonth() ? 'lightblue' : 'transparent'}
            />
            <text
              textAnchor="middle"
              dominantBaseline="middle"
              style={{
                fontSize: '1.2em',
                color: 'black',
                fontWeight: 'normal',
                backgroundColor: index === today.getMonth() ? 'lightblue' : 'transparent',
              }}
            >
              {month.abbreviated?.translated}
            </text>
          </g>
        );
      })}
    </DemoSVG>
  );
};

export default DemoMonthsGrid;
