import type { DataPage, DataSection } from '@data/DataSection';

import { useCompletionForSection } from '../getDataEntriesForSection';

import PieChart from './PieChart';

type Props = {
  page: DataPage;
  section?: DataSection;
};

const ProgressCircle: React.FC<Props> = ({ page, section }) => {
  const completion = useCompletionForSection(page, section);
  if (completion === undefined) return <div />;
  return <PieChart label={`${completion.toFixed(0)}%`} fraction={completion / 100} />;
};

export default ProgressCircle;
