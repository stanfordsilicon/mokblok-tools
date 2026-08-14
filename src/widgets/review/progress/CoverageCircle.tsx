import type { DataPage, DataSection } from '@data/DataSection';

import { useURLParams } from '@settings/URLParams';

import { useDataEntriesForSection } from '../getDataEntriesForSection';

import PieChart from './PieChart';

type Props = {
  page: DataPage;
  section?: DataSection;
};

const CoverageCircle: React.FC<Props> = ({ page, section }) => {
  const { coverageLevel } = useURLParams();
  const dataEntries = useDataEntriesForSection()(page, section);
  const coveredDataEntries = dataEntries.filter((entry) => entry.level <= coverageLevel);
  const coverageLevels = dataEntries.map((entry) => entry.level);
  const coverageHistogram = Array.from(
    { length: 8 },
    (_, i) => coverageLevels.filter((level) => level === i).length / dataEntries.length,
  );

  if (dataEntries.length === 0) return <div />;
  return (
    <PieChart
      label={`${((coveredDataEntries.length / dataEntries.length) * 100).toFixed(0)}%`}
      fraction={coverageHistogram}
    />
  );
};

export default CoverageCircle;
