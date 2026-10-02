import { DataSection } from '@data/DataSection';
import { useSourceDataContext } from '@data/source/SourceDataProvider';
import { useTargetTranslationLookup } from '@data/target/useTargetTranslation';

import { uniqueBy } from '@shared/setUtils';

type Props = {
  hourFormat: '12h' | '24h';
};

const DemoTimeMeetingsToday: React.FC<Props> = ({ hourFormat }) => {
  const { findDataEntry, findDataEntries } = useSourceDataContext();
  const getTranslation = useTargetTranslationLookup();

  const todayEntry = findDataEntry({
    instance: '0',
    section: DataSection.RelativeTime,
    field: 'd',
  });
  const times = uniqueBy(
    findDataEntries({
      section: DataSection.Times,
      field: 'availableFormats',
      instance: hourFormat === '12h' ? 'hm' : 'Hm',
    }),
    (f) => f.english,
  );
  const morningWord = findDataEntry({ instance: 'morning1' });
  const afternoonWord = findDataEntry({ instance: 'afternoon1' });
  const [morningTime, afternoonTime] = times.sort((a, b) => (a.var1 ?? 0) - (b.var1 ?? 0));

  return (
    <>
      <rect x={10} y={10} width={220} height={40} fill="#ddd" stroke="#ccc" rx="10" ry="10" />
      <text x={120} y={35} fontSize="1.2em" style={{ textAnchor: 'middle' }}>
        {getTranslation(todayEntry)}
      </text>
      <g transform={`translate(20, 80)`}>
        <text>{getTranslation(morningWord)}</text>
        <rect
          y={10}
          width={hourFormat === '12h' ? 80 : 60}
          height={30}
          fill="#eee"
          stroke="#cccc"
          rx="5"
          ry="5"
        />
        <text x={10} y={30}>
          {getTranslation(morningTime)}
        </text>
      </g>
      <g transform={`translate(20, 150)`}>
        <text>{getTranslation(afternoonWord)}</text>
        <rect
          y={10}
          width={hourFormat === '12h' ? 80 : 60}
          height={30}
          fill="#eee"
          stroke="#cccc"
          rx="5"
          ry="5"
        />
        <text x={10} y={30}>
          {getTranslation(afternoonTime)}
        </text>
      </g>
    </>
  );
};

export default DemoTimeMeetingsToday;
