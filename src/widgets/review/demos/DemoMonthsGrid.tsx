import { useDataContext } from '@data/DataContext';

import DemoID from './DemoID';
import DemoSVG from './DemoSVG';

const DemoMonthsGrid: React.FC = () => {
  const { monthsData } = useDataContext();
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
        {new Date().getFullYear()}
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
    </DemoSVG>
  );
};

export default DemoMonthsGrid;
