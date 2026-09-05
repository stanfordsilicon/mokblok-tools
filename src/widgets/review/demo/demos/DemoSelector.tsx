import { useCallback, useState } from 'react';

import { DataEntry } from '@data/DataTypes';
import { DayKeys } from '@data/DayKeys';
import { useSourceDataContext } from '@data/source/SourceDataProvider';
import { useTargetDataContext } from '@data/target/TargetDataProvider';

import { sortBy } from '@shared/setUtils';
import useInterfaceTranslation from '@shared/useInterfaceTranslation';

const DemoSelector = ({ entryFilter }: { entryFilter: Partial<DataEntry> }) => {
  const { uitext } = useInterfaceTranslation();
  const { findDataEntries } = useSourceDataContext();
  const { getTranslation } = useTargetDataContext();
  const options = sortBy(findDataEntries(entryFilter), getSortFunction(entryFilter)).map((entry) =>
    getTranslation(entry),
  );
  const [currentIndex, setCurrentIndex] = useState(3);

  const onClick = useCallback((index: number) => setCurrentIndex(index), []);
  const title = getTitle(findDataEntries, getTranslation, uitext, entryFilter);

  return (
    <SelectorSVG options={options} title={title} currentIndex={currentIndex} onClick={onClick} />
  );
};

type SelectorSVGProps = {
  options: string[];
  title: string;
  currentIndex: number;
  onClick?: (i: number) => void;
};

const SelectorSVG = ({ options, title, currentIndex, onClick }: SelectorSVGProps) => {
  const hoveredIndex = 4;

  return (
    <>
      {/* <rect x={10} y={10} width={200} height={30} fill="lightgrey" stroke="black" /> */}
      <text x={40} y={25} textAnchor="start" fontSize="14px" fontWeight="bold">
        {title}:
      </text>
      <text x={40} y={45} textAnchor="start" fontSize="14px">
        {options[currentIndex]} ▼
      </text>
      <g className="group" style={{ transform: `translate(50px, 50px)` }}>
        <rect
          x={-1}
          width={152}
          height={Math.min(options.length, 9) * 20}
          stroke="black"
          fill="white"
          rx={5}
          ry={5}
          style={{ filter: 'drop-shadow(10px 10px 10px rgba(0, 0, 0, 0.25))' }}
        />
        {options.slice(0, 9).map((option, index) => (
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
              width={150}
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
    </>
  );
};

function getSortFunction(filter: Partial<DataEntry>) {
  if (filter.field === 'M') return (d: DataEntry) => Number(d.instance);
  if (filter.field === 'E') return (d: DataEntry) => DayKeys.findIndex((k) => k === d.instance);

  return (d: DataEntry) => d.instance;
}

function getTitle(
  findDataEntries: (filter: Partial<DataEntry>) => DataEntry[],
  getTranslation: (entry: DataEntry) => string,
  uiText: (s: string) => string,
  filter: Partial<DataEntry>,
) {
  if (filter.field === 'M')
    return (
      getTranslation(findDataEntries({ field: 'M', length: 'w' })[0]) ||
      uiText('dataSection.Months')
    );
  if (filter.field === 'E')
    return getTranslation(findDataEntries({ field: 'E' })[0]) || uiText('dataSection.DaysOfWeek');
  const entries = findDataEntries(filter);
  if (entries.length === 0) return 'No Entries';
  return getTranslation(entries[0]);
}

export default DemoSelector;
