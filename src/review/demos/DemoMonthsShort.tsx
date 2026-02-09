import { useDataContext } from '../../data/DataContext';
import DemoID from './DemoID';

const MockMonthsShort: React.FC = () => {
  const { monthsData } = useDataContext();

  return (
    <svg id={DemoID.MonthsShort} width="300" height="300">
      <image href="./demos/months_short.png" width="300" height="300" />
      {monthsData.map((month, index) => {
        const x = index * 21 + 25;
        const y = 200;
        return (
          <text
            key={index}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            style={{
              fontSize: '.5em',
              color: index == 6 ? 'blue' : 'black',
              fontWeight: index == 6 ? 'bold' : 'normal',
            }}
          >
            {month.narrow?.translated}
          </text>
        );
      })}
    </svg>
  );
};

export default MockMonthsShort;
