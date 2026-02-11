import React from 'react';

import { useDataContext } from '@data/DataContext';

import DemoID from './DemoID';
import DemoSVG from './DemoSVG';

type ClimateDataPoint = {
  recordHigh: number;
  high: number;
  mean: number;
  low: number;
  recordLow: number;
};

const simulatedClimateData: ClimateDataPoint[] = [
  { recordHigh: 16, high: 14, mean: 10, low: 5, recordLow: -2 }, // January
  { recordHigh: 18, high: 16, mean: 12, low: 7, recordLow: -1 }, // February
  { recordHigh: 22, high: 19, mean: 15, low: 10, recordLow: 2 }, // March
  { recordHigh: 27, high: 24, mean: 20, low: 14, recordLow: 5 }, // April
  { recordHigh: 32, high: 29, mean: 25, low: 18, recordLow: 10 }, // May
  { recordHigh: 37, high: 34, mean: 30, low: 22, recordLow: 15 }, // June
  { recordHigh: 40, high: 37, mean: 33, low: 25, recordLow: 18 }, // July
  { recordHigh: 38, high: 35, mean: 31, low: 24, recordLow: 17 }, // August
  { recordHigh: 33, high: 30, mean: 26, low: 19, recordLow: 12 }, // September
  { recordHigh: 28, high: 25, mean: 21, low: 14, recordLow: 5 }, // October
  { recordHigh: 22, high: 19, mean: 15, low: 10, recordLow: 2 }, // November
  { recordHigh: 17, high: 14, mean: 10, low: 5, recordLow: -1 }, // December
];

const MockMonthsTemp: React.FC = () => {
  const { monthsData } = useDataContext();

  return (
    <DemoSVG id={DemoID.MonthsTemp} width={240} height={150}>
      {/* Climate bars */}
      {simulatedClimateData.map((data, index) => {
        const { recordHigh, high, mean, low, recordLow } = data;
        const x = index * 18 + 15;
        return (
          <React.Fragment key={index}>
            {/* Record High */}
            <rect x={x} y={100 - recordHigh * 2} width="10" height="2" fill="red" />
            {/* Usual Temps */}
            <rect x={x} y={100 - high * 2} width="10" height={(high - low) * 2} fill="lightgrey" />
            {/* Mean */}
            <rect x={x} y={100 - mean * 2} width="10" height="2" fill="black" />
            {/* Record Low */}
            <rect x={x} y={100 - recordLow * 2} width="10" height="2" fill="blue" />
          </React.Fragment>
        );
      })}

      {/* Narrow month labels */}
      {monthsData.map((month, index) => {
        const x = index * 18 + 20;
        const y = 130;
        return (
          <text
            key={index}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            style={{ fontSize: '.75em', color: 'black' }}
          >
            {month.narrow?.translated}
          </text>
        );
      })}
    </DemoSVG>
  );
};

export default MockMonthsTemp;
