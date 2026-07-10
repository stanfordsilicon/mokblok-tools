import { useDataContext } from '@data/DataContext';
import type { DataEntry } from '@data/DataTypes';

import { uniqueBy } from '@shared/setUtils';

const DemoTimeInterval: React.FC<{ pattern: string }> = ({ pattern }) => {
  const { findDataEntry, findDataEntries, getTranslation } = useDataContext();
  const date = findDataEntry({ field: 'availableFormats', instance: 'MEd' });
  const intervals = uniqueBy(
    findDataEntries({ field: 'intervalFormats', instance: pattern }).filter(
      (f) => f.english !== '3:00 PM – 4:00 PM' && f.english !== '3 PM - 4 PM',
    ),
    (f) => f.english,
  );

  const indexToHour = (hour: number) => {
    if (pattern.includes('H')) return `${hour}:00`;
    return `${((hour + 11) % 12) + 1} ${hour < 12 ? 'AM' : 'PM'}`;
  };
  const intervalToHourNums = (interval: DataEntry) => {
    const parts = interval.english
      .replace('PT', '')
      .split(/–|-/)
      .map((s) => s.trim())
      .map((s) => (!s.match(/:[0-9]{2}/) ? s.replace(/^([0-9]+)([^:]|$)/, '$1:00$2') : s)); // Add ":00" to hour-only times for Date parsing
    const parsed = parts
      .map((s) => (parts[1].includes('PM') && !s.includes('M') ? `${s} PM` : s))
      .map((s) => `1970-01-01 ${s}`)
      .map((s) => new Date(s))
      .map((d) => d.getHours() + d.getMinutes() / 60);
    return parsed;
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
            intervalToHourNums(a).reduce((sum, num) => sum + num, 0) / 2 -
            intervalToHourNums(b).reduce((sum, num) => sum + num, 0) / 2,
        )
        .map((int, index) => {
          const hourNums = intervalToHourNums(int);
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
