import { useDataContext } from '@data/DataContext';

const DemoTimeInterval: React.FC<{ variant: '' | 'variant' }> = ({ variant }) => {
  const { findDataField, getTranslation } = useDataContext();
  const eraTitle = findDataField({ field: 'G', instance: '' });
  const pastShort = findDataField({ field: 'G', instance: '0', length: 'a', variant });
  const pastLong = findDataField({ field: 'G', instance: '0', length: 'w', variant });
  const presentShort = findDataField({ field: 'G', instance: '1', length: 'a', variant });
  const presentLong = findDataField({ field: 'G', instance: '1', length: 'w', variant });

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
      <text x={120} y={40} textAnchor="middle" fontSize="1.2em">
        {getTranslation(eraTitle)}
      </text>
      <g id="timeline" transform="translate(120, 110)">
        <line
          x1={-100}
          y1={0}
          x2={100}
          y2={0}
          stroke="black"
          strokeWidth={2}
          markerStart="url(#arrow)"
          markerEnd="url(#arrow)"
        />
        <line x1={0} y1={-10} x2={0} y2={10} stroke="black" strokeWidth={2} />
      </g>
      <g id="labels" transform="translate(120, 140)">
        <text x={-50} y={0} textAnchor="middle">
          {getTranslation(pastShort)}
        </text>
        <text x={-50} y={20} textAnchor="middle" fontSize="0.8em">
          {getTranslation(pastLong)}
        </text>
        <text x={50} y={0} textAnchor="middle">
          {getTranslation(presentShort)}
        </text>
        <text x={50} y={20} textAnchor="middle" fontSize="0.8em">
          {getTranslation(presentLong)}
        </text>
      </g>
    </>
  );
};

export default DemoTimeInterval;
