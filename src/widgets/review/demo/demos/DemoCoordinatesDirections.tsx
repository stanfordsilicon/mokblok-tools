import React from 'react';

import { useDataContext } from '@data/DataContext';
import { CardinalDirection } from '@data/DataTypes';

const DemoCoordinatesDirections: React.FC = () => {
  const { findDataEntry, getTranslation } = useDataContext();
  const south = findDataEntry({
    field: 'coordinateUnitPattern',
    instance: CardinalDirection.South,
    length: 'long',
  });
  const west = findDataEntry({
    field: 'coordinateUnitPattern',
    instance: CardinalDirection.West,
    length: 'long',
  });
  const direction = findDataEntry({ field: 'ordinalMinimalPairs', instance: 'one' });

  return (
    <>
      <rect x={10} y={10} width={220} height={50} fill="#f9f9f9" stroke="#ccc" rx={15} ry={15} />
      <text x={20} y={30}>
        Directions to...
      </text>
      <text x={20} y={50}>
        {getTranslation(south)} {getTranslation(west)}
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
        {getTranslation(direction)}
      </text>
    </>
  );
};

export default DemoCoordinatesDirections;
