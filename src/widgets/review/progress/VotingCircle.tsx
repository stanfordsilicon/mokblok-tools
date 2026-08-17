import type { DataPage, DataSection } from '@data/DataSection';

import { useVotingCompletionForSection } from '../getDataEntriesForSection';

import PieChart from './PieChart';

type Props = {
  page: DataPage;
  section?: DataSection;
};

const VotingCircle: React.FC<Props> = ({ page, section }) => {
  const voteCounts = useVotingCompletionForSection(page, section);

  if (voteCounts.total === 0) return <div />;
  return (
    <PieChart
      label={`${((voteCounts.accepted / voteCounts.total) * 100).toFixed(0)}%`}
      fraction={[voteCounts.rejected / voteCounts.total, voteCounts.accepted / voteCounts.total]}
    />
  );
};

export default VotingCircle;
