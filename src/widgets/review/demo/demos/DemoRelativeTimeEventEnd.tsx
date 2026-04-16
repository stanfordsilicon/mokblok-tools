import { useDataContext } from '@data/DataContext';

import { groupBy } from '@shared/setUtils';

const DemoRelativeTimeEventEnd: React.FC = () => {
  const { findDataField, findDataFields, getTranslation } = useDataContext();
  const nextTimes = groupBy(
    findDataFields({ subject: 'dates', instance: '1', length: '' }),
    (f) => f.field,
  );
  const todayField = findDataField({ subject: 'dates', field: 'd', instance: '0', length: '' });

  return (
    <>
      <defs>
        <marker
          id="arrow"
          viewBox="0 0 10 10"
          refX="5"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" />
        </marker>
      </defs>
      {['d', 'M', 'y'].map((period, index) => (
        <g id="periods" transform={`translate(30, ${50 + index * 60})`}>
          <text x={0} y={0} textAnchor="start">
            {getTranslation(todayField)} ➔ {getTranslation(nextTimes[period][0])}
          </text>
          <text x={0} y={20} textAnchor="start" fontSize="0.8em">
            {getTranslation(findDataField({ variant: period.toLowerCase(), instance: 'yMd' })!)}
          </text>
        </g>
      ))}
    </>
  );
};

export default DemoRelativeTimeEventEnd;
