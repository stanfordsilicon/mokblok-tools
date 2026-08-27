import type { DataPage, DataSection } from '@data/DataSection';

import { useCompletionForSection } from '../getDataEntriesForSection';

import PieChart from './PieChart';

type Props = {
  page: DataPage;
  section?: DataSection;
};

const ProgressCircle: React.FC<Props> = ({ page, section }) => {
  const completion = useCompletionForSection(page, section);

  if (completion.overall === 0) return <div />;
  return (
    <div className="w-full">
      <PieChart
        label={completion.percent != undefined ? `${completion.percent?.toFixed(0)}%` : undefined}
        fraction={(completion.percent ?? 0) / 100}
      />
    </div>
  );
};

export default ProgressCircle;
