import type { DataEntry } from '@data/DataTypes';
import { useSourceDataContext } from '@data/source/SourceDataProvider';
import { useTargetDataContext } from '@data/target/TargetDataProvider';

import { uniqueBy } from '@shared/setUtils';

const DemoTimeInterval: React.FC<{ pattern: string }> = ({ pattern }) => {
  const { findDataEntry, findDataEntries } = useSourceDataContext();
  const { getTranslation } = useTargetDataContext();

  const date = findDataEntry({ field: 'availableFormats', instance: 'MEd' });
  const intervals = uniqueBy(
    findDataEntries({ field: 'intervalFormats', instance: pattern }).filter(
      (f) => f.english !== '3:00 PM – 4:00 PM' && f.english !== '3 PM - 4 PM',
    ),
    (f) => f.english,
  );

  // TODO use formatting from the translations
  const indexToHour = (hour: number) => {
    if (pattern.includes('H')) return `${hour}:00`;
    return `${((hour + 11) % 12) + 1} ${hour < 12 ? 'AM' : 'PM'}`;
  };
  const getHourNums = (interval: DataEntry) => {
    if (!interval.var1 || !interval.var2) {
      console.log('interval', interval.english, 'missing var1 or var2');
      return [0, 0];
    }
    const parsed = new Date(interval.var1);
    const parsed2 = new Date(interval.var2);
    return [
      parsed.getHours() + parsed.getMinutes() / 60,
      parsed2.getHours() + parsed2.getMinutes() / 60,
    ];
  };

  return (
    <>
      <text x={20} y={30} fontSize="1.2em">
        Pick a time on {getTranslation(date)}
      </text>
      <g>
        {[...Array(9)].map((_, index) => (
          <g key={index}>
            <path d={`M20 ${50 + index * 20} L220 ${50 + index * 20}`} stroke="#ccc" />
            <text x={20} y={60 + index * 20} fontSize="0.8em">
              {indexToHour(index + 9)}
            </text>
          </g>
        ))}
      </g>
      {/* <rect x="50" y="60" width="60" height="20" fill="#fccc" stroke="#cccc" rx="10" ry="10" /> */}
      horizontal lines to break the above box into multiple hours
      {intervals
        .sort(
          (a, b) =>
            getHourNums(a).reduce((sum, num) => sum + num, 0) / 2 -
            getHourNums(b).reduce((sum, num) => sum + num, 0) / 2,
        )
        .map((int, index) => {
          const hourNums = getHourNums(int);
          if (hourNums[0] > hourNums[1]) {
            console.log('interval', int.english, int.var1, int.var2, 'hourNums', hourNums);
          }
          return (
            <g key={index} transform={`translate(${index * 50 + 60}, 50)`}>
              <rect
                x={0}
                y={(hourNums[0] - 9) * 20}
                width={40}
                height={(hourNums[1] - hourNums[0]) * 20}
                fill="#ccfc"
                stroke="#cccc"
                rx="10"
                ry="10"
              />
              <text
                x={index * 20}
                y={
                  (hourNums[index === intervals.length - 1 ? 1 : 0] - 9) * 20 +
                  (index === intervals.length - 1 ? 5 : -5)
                }
                style={{
                  textAnchor: index === 0 ? 'start' : index === 1 ? 'middle' : 'end',
                  dominantBaseline: index === intervals.length - 1 ? 'hanging' : undefined,
                }}
              >
                {getTranslation(int)}
              </text>
            </g>
          );
        })}
    </>
  );
};

export default DemoTimeInterval;
