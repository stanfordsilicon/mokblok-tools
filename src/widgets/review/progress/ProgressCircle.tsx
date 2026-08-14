import type { DataPage, DataSection } from '@data/DataSection';

import { useURLParams } from '@settings/URLParams';

import useInterfaceTranslation from '@shared/useInterfaceTranslation';

import { useCompletionForSection } from '../getDataEntriesForSection';

import PieChart from './PieChart';

type Props = {
  page: DataPage;
  section?: DataSection;
};

const ProgressCircle: React.FC<Props> = ({ page, section }) => {
  const { uitext } = useInterfaceTranslation();
  const { coverageLevel } = useURLParams();
  const completion = useCompletionForSection(page, section, coverageLevel);
  if (completion.overall === 0) return <div />;
  const ratioComplete = uitext('review.progress.ratioComplete', {
    completed: completion.completed,
    inCoverage: completion.inCoverage,
  });
  const outOfCoverage =
    completion.inCoverage < completion.overall
      ? uitext('review.progress.outOfCoverage', {
          count: completion.overall - completion.inCoverage,
        })
      : '';
  return (
    <div className="w-full" title={`${ratioComplete}${outOfCoverage ? `. ${outOfCoverage}` : ''}`}>
      <PieChart
        label={`${completion.percent?.toFixed(0)}%`}
        fraction={(completion.percent ?? 0) / 100}
      />
    </div>
  );
};

export default ProgressCircle;
