import { DataSection } from '@data/DataSection';
import { DayKeys } from '@data/DayKeys';
import { useSourceDataContext } from '@data/source/SourceDataProvider';
import { useTargetDataContext, useTargetDataStore } from '@data/target/TargetDataProvider';

type Props = {
  instance: string;
};

const DemoDateIntervalAcrossMonths: React.FC<Props> = ({ instance }) => {
  const { findDataEntry } = useSourceDataContext();
  const getTranslation = useTargetDataStore((state) => state.getTranslation);
  const entry = findDataEntry({
    section: DataSection.DateIntervals,
    field: 'intervalFormats',
    instance,
    variant: 'M',
  });
  const start = new Date(entry?.var1 ?? 0);
  const end = new Date(entry?.var2 ?? entry?.var1 ?? 0);

  return (
    <>
      <text x={120} y={35} textAnchor="middle" fontSize="14" fontWeight="bold">
        {getTranslation(entry) || '—'}
      </text>
      <MonthCalendar
        date={start}
        start={start}
        end={end}
        x={8}
        getTranslation={getTranslation}
        findDataEntry={findDataEntry}
      />
      <MonthCalendar
        date={end}
        start={start}
        end={end}
        x={126}
        getTranslation={getTranslation}
        findDataEntry={findDataEntry}
      />
    </>
  );
};

type MonthCalendarProps = {
  date: Date;
  start: Date;
  end: Date;
  x: number;
  getTranslation: ReturnType<typeof useTargetDataContext>['getTranslation'];
  findDataEntry: ReturnType<typeof useSourceDataContext>['findDataEntry'];
};

const MonthCalendar: React.FC<MonthCalendarProps> = ({
  date,
  start,
  end,
  x,
  getTranslation,
  findDataEntry,
}) => {
  const firstDayOfMonth = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1),
  ).getUTCDay();
  const monthName = getTranslation(
    findDataEntry({
      section: DataSection.Months,
      field: 'M',
      instance: String(date.getUTCMonth() + 1),
      length: 'w',
    }),
  );

  return (
    <g transform={`translate(${x},80)`}>
      <text x={53} y={0} textAnchor="middle" fontSize="10" fontWeight="bold">
        {monthName}
      </text>
      {DayKeys.map((day, index) => (
        <text key={day} x={index * 15 + 7.5} y={15} textAnchor="middle" fill="#64748b" fontSize="7">
          {getTranslation(findDataEntry({ field: 'E', length: 'n', instance: day }))}
        </text>
      ))}
      {Array.from({ length: 6 }, (_, weekIndex) =>
        Array.from({ length: 7 }, (_, dayIndex) => {
          const dayNumber = weekIndex * 7 + dayIndex - firstDayOfMonth + 1;
          const cellDate = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), dayNumber));
          const isCurrentMonth = cellDate.getUTCMonth() === date.getUTCMonth();
          const isInRange = cellDate >= start && cellDate <= end;
          return (
            <g
              key={`${weekIndex}-${dayIndex}`}
              transform={`translate(${dayIndex * 15},${weekIndex * 15 + 20})`}
            >
              <rect
                width={15}
                height={15}
                fill={isInRange && isCurrentMonth ? '#bfdbfe' : 'transparent'}
                stroke="#e2e8f0"
              />
              <text
                x={7.5}
                y={8}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={isCurrentMonth ? '#0f172a' : '#cbd5e1'}
                fontSize="8"
              >
                {cellDate.getUTCDate()}
              </text>
            </g>
          );
        }),
      )}
    </g>
  );
};

export default DemoDateIntervalAcrossMonths;
