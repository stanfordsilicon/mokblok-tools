import { DataSection } from '@data/DataSection';

import SourceLanguageLabel from '@settings/SourceLanguageLabel';
import TargetLanguageLabel from '@settings/TargetLanguageLabel';
import { useURLParams } from '@settings/URLParams';

import { sortBy, uniqueBy } from '@shared/setUtils';
import useInterfaceTranslation from '@shared/useInterfaceTranslation';

import { useFindDataEntriesInScope } from '../getDataEntriesForSection';
import InputDataCell from '../input/InputDataCell';
import SourceDataCell from '../SourceDataCell';

function DateTimeCombinationsReviewTable() {
  const { admin } = useURLParams();
  const findDataEntries = useFindDataEntriesInScope();
  const availableFormats = uniqueBy(
    sortBy(
      findDataEntries({ section: DataSection.DateTimes }),
      (entry) => entry.field + entry.variant + entry.length,
    ),
    (entry) => entry.field + entry.variant + entry.length,
  );
  const { uitext } = useInterfaceTranslation();

  return (
    <table>
      <thead>
        <tr>
          {admin && <th>{uitext('review.field')}</th>}
          {admin && <th>{uitext('review.variant')}</th>}
          {admin && <th>{uitext('review.length')}</th>}
          <th>
            <SourceLanguageLabel />
          </th>
          <th>
            <TargetLanguageLabel />
          </th>
        </tr>
      </thead>
      <tbody>
        {availableFormats?.map((entry) => (
          <tr key={entry.id}>
            {admin && <td>{entry.field}</td>}
            {admin && <td>{entry.variant}</td>}
            {admin && <td>{entry.length}</td>}
            <SourceDataCell entry={entry} />
            <InputDataCell
              entry={entry}
              inputWidth={
                entry.field === 'dateFormats' ? (entry.length === 'full' ? '15em' : '10em') : '25em'
              }
            />
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default DateTimeCombinationsReviewTable;
