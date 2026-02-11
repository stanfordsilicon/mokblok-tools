import { useDataContext } from '@data/DataContext';

import DemoID from './DemoID';

const DemoMonthsGrid: React.FC = () => {
  const { monthsData } = useDataContext();
  return (
    <svg id={DemoID.MonthsGrid} width="300" height="300">
      <rect x="10" y="10" width="280" height="280" fill="white" rx="10" ry="10" />
      <path d="M60 35 L55 40 L60 45" stroke="#ccc" fill="none" strokeWidth="2" />
      <text x="150" y="40" textAnchor="middle" dominantBaseline="middle" fontSize="1.2em">
        {new Date().getFullYear()}
      </text>
      <path d="M240 35 L245 40 L240 45" stroke="#ccc" fill="none" strokeWidth="2" />
      {monthsData.map((month, index) => {
        const x = (index % 4) * 60 + 60;
        const y = Math.floor(index / 4) * 65 + 100;
        return (
          <text
            key={index}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            style={{
              fontSize: '1.2em',
              color: 'black',
              fontWeight: 'normal',
            }}
          >
            {month.abbreviated?.translated}
          </text>
        );
      })}
    </svg>
  );
};

export default DemoMonthsGrid;
