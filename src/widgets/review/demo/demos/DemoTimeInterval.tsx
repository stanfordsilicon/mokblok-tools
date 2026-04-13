import { useDataContext } from '@data/DataContext';

const DemoTimeInterval: React.FC<{ pattern: string }> = ({ pattern }) => {
  const { findDataField, findDataFields, getTranslation } = useDataContext();
  const date = findDataField({ field: 'availableFormats', instance: 'MEd' });
  const intervals = findDataFields({ field: 'intervalFormats', instance: pattern });
  console.log(intervals);

  const getHour = (hour: number) => {
    if (pattern.includes('H')) {
      return `${hour}:00`;
    }
    return `${((hour + 11) % 12) + 1} ${hour < 12 ? 'AM' : 'PM'}`;
  };

  return (
    <>
      <text x={10} y={20} fontSize="1.2em">
        Pick a time on {getTranslation(date)}
      </text>
      <g>
        {[...Array(9)].map((_, index) => (
          <g key={index}>
            <path d={`M20 ${40 + index * 20} L80 ${40 + index * 20}`} stroke="#ccc" />
            <text x={20} y={50 + index * 20} fontSize="0.8em">
              {getHour(index + 9)}
            </text>
          </g>
        ))}
      </g>
      {/* <rect x="50" y="60" width="60" height="20" fill="#fccc" stroke="#cccc" rx="10" ry="10" /> */}
      horizontal lines to break the above box into multiple hours
      {intervals.map((int, index) => (
        <text x={100} y={60 + index * 20} key={index} fontSize="0.8em">
          {int.english}
        </text>
      ))}
    </>
  );
};

export default DemoTimeInterval;
