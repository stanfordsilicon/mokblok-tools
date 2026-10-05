import React from 'react';

import { CardinalDirection } from '@data/DataTypes';
import { useSourceDataContext } from '@data/source/SourceDataProvider';
import { useTargetTranslation } from '@data/target/useTargetTranslation';

import useInterfaceTranslation from '@shared/useInterfaceTranslation';

const DemoCoordinatesDirections: React.FC = () => {
  const { uitext } = useInterfaceTranslation();
  const { findDataEntry } = useSourceDataContext();

  const south = useTargetTranslation(
    findDataEntry({
      field: 'coordinateUnitPattern',
      instance: CardinalDirection.South,
      length: 'long',
    }),
  );
  const west = useTargetTranslation(
    findDataEntry({
      field: 'coordinateUnitPattern',
      instance: CardinalDirection.West,
      length: 'long',
    }),
  );
  const direction = useTargetTranslation(
    findDataEntry({ field: 'ordinalMinimalPairs', instance: 'one' }),
  );

  return (
    <>
      <rect x={10} y={10} width={220} height={50} fill="#f9f9f9" stroke="#ccc" rx={15} ry={15} />
      <text x={20} y={30}>
        {uitext('mocks.Directions todotdotdot')}
      </text>
      <text x={20} y={50}>
        {south} {west}
      </text>
      <rect x={20} y={80} width={100} height={40} fill="lightgreen" stroke="#ccc" rx={5} ry={5} />
      <rect x={140} y={80} width={80} height={40} fill="lightgreen" stroke="#ccc" rx={5} ry={5} />
      <rect x={20} y={140} width={100} height={40} fill="lightgreen" stroke="#ccc" rx={5} ry={5} />
      <rect x={140} y={140} width={80} height={40} fill="lightgreen" stroke="#ccc" rx={5} ry={5} />
      <path
        d="M130 200 L130 140 C130 137, 137 130, 140 130 L180 130"
        stroke="blue"
        fill="none"
        strokeWidth="8"
      />
      <text x={180} y={120} fontSize="2em" textAnchor="middle">
        📍
      </text>
      <rect x={10} y={200} width={220} height={30} fill="#f9f9f9" stroke="#ccc" rx={15} ry={15} />
      <text x={20} y={220}>
        {direction}
      </text>
    </>
  );
};

export default DemoCoordinatesDirections;
