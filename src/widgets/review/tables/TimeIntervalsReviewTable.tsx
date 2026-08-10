import { useDataContext } from '@data/DataContext';
import { DataSection } from '@data/DataSection';

import SourceLanguageLabel from '@settings/SourceLanguageLabel';
import { useURLParams } from '@settings/URLParams';

import { sortBy, uniqueBy } from '@shared/setUtils';
import useInterfaceTranslation from '@shared/useInterfaceTranslation';

import InputDataCell from '../input/InputDataCell';
import SourceDataCell from '../SourceDataCell';

function TimeIntervalsReviewTable() {
  const { uitext } = useInterfaceTranslation();
  const { admin } = useURLParams();
  const { findDataEntries } = useDataContext();
  const intervalFormats = uniqueBy(
    sortBy(findDataEntries({ section: DataSection.TimeIntervals }), (f) => f.instance),
    (f) => f.english,
  );

  return (
    <table>
      <thead>
        <tr>
          {admin && <th>{uitext('review.components')}</th>}
          {admin && <th>{uitext('review.greatestDifference')}</th>}
          <th style={{ textAlign: 'center' }}>
            <SourceLanguageLabel />
          </th>
          <th style={{ textAlign: 'center' }}>{uitext('review.translated')}</th>
        </tr>
      </thead>
      <tbody>
        {intervalFormats.map((entry) => (
          <tr key={entry.index}>
            {admin && <td>{entry.instance}</td>}
            {admin && <td>{entry.variant}</td>}
            <SourceDataCell entry={entry} />
            <InputDataCell entry={entry} inputWidth="15em" />
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default TimeIntervalsReviewTable;
