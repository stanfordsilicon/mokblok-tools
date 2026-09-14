import { useCallback, useMemo, useState } from 'react';

import { DataEntry } from '@data/DataTypes';
import { DayKeys } from '@data/DayKeys';
import { useSourceDataContext } from '@data/source/SourceDataProvider';
import { useTargetDataContext } from '@data/target/TargetDataProvider';

import { sortBy } from '@shared/setUtils';

const DemoSelector = ({ entryFilter }: { entryFilter: Partial<DataEntry> }) => {
  const { findDataEntries } = useSourceDataContext();
  const { getTranslation } = useTargetDataContext();
  const options = useMemo(
    () =>
      sortBy(findDataEntries(entryFilter), getSortFunction(entryFilter, getTranslation)).map(
        (entry) => getTranslation(entry),
      ),
    [getTranslation, findDataEntries, entryFilter],
  );
  const [currentIndex, setCurrentIndex] = useState(3);

  const onClick = useCallback((index: number) => setCurrentIndex(index), []);

  return (
    <SelectorSVG
      options={options}
      currentIndex={currentIndex}
      onClick={onClick}
      moreWidth={entryFilter.field === 'metazone'}
    />
  );
};

type SelectorSVGProps = {
  options: string[];
  currentIndex: number;
  onClick?: (i: number) => void;
  moreWidth?: boolean;
};

const SelectorSVG = ({ options, currentIndex, onClick, moreWidth }: SelectorSVGProps) => {
  const hoveredIndex = 4;
  const numShown = Math.min(options.length, 9);

  return (
    <g style={{ transform: `translateY(${(9 - numShown) * 10}px)` }}>
      <text x={moreWidth ? 5 : 40} y={30} textAnchor="start" fontSize="14px">
        {options[currentIndex]} ▼
      </text>
      <g style={{ transform: moreWidth ? `translate(20px, 40px)` : `translate(60px, 40px)` }}>
        <rect
          x={-1}
          width={moreWidth ? 202 : 152}
          height={numShown * 20}
          stroke="black"
          fill="white"
          rx={5}
          ry={5}
          style={{ filter: 'drop-shadow(10px 10px 10px rgba(0, 0, 0, 0.25))' }}
        />
        {options.slice(0, numShown).map((option, index) => (
          <g key={index} style={{ transform: `translateY(${index * 20}px)` }}>
            <rect
              className={
                (index === hoveredIndex ? 'fill-[skyblue]' : 'fill-transparent') +
                ' group-hover:fill-transparent! hover:fill-[skyblue]! cursor-pointer'
              }
              x={0}
              y={0}
              rx={5}
              ry={5}
              width={moreWidth ? 200 : 150}
              height={20}
              fill={index === hoveredIndex ? 'skyblue' : 'transparent'}
              // stroke="black"
              onClick={() => onClick?.(index)}
            />
            {index === currentIndex && (
              <text x={10} y={15} textAnchor="start" fontSize="12px" pointerEvents="none">
                ✓
              </text>
            )}
            <text x={30} y={15} textAnchor="start" fontSize="12px" pointerEvents="none">
              {option}
            </text>
            {index === hoveredIndex + 1 && (
              <text
                className="group-hover:invisible"
                x={75}
                y={5}
                textAnchor="start"
                fontSize="20px"
                pointerEvents="none"
              >
                👆
              </text>
            )}
          </g>
        ))}
      </g>
    </g>
  );
};

function getSortFunction(filter: Partial<DataEntry>, getTranslation: (entry: DataEntry) => string) {
  if (filter.field === 'M') return (d: DataEntry) => Number(d.instance);
  if (filter.field === 'E') return (d: DataEntry) => DayKeys.findIndex((k) => k === d.instance);

  return (d: DataEntry) => getTranslation(d);
}

export default DemoSelector;
