import { DataSection } from '@data/DataSection';

import SourceLanguageLabel from '@settings/SourceLanguageLabel';
import TargetLanguageLabel from '@settings/TargetLanguageLabel';
import { useURLParams } from '@settings/URLParams';

import useInterfaceTranslation from '@shared/useInterfaceTranslation';

import { useFindDataEntriesInScope } from '../getDataEntriesForSection';
import InputDataCell from '../input/InputDataCell';
import SourceDataCell from '../SourceDataCell';

function EraDatesReviewTable() {
  const { uitext } = useInterfaceTranslation();
  const { admin } = useURLParams();
  const findDataEntries = useFindDataEntriesInScope();
  const allEraFields = findDataEntries({ section: DataSection.EraDates });
  const availableEraDates = allEraFields.filter((f) => f.field === 'availableFormats');
  const eraIntervals = allEraFields.filter((f) => f.field === 'intervalFormats');

  return (
    <div>
      Note: When this data was originally requested, it did not keep eras in the examples so the
      original translations may be missing era fields.
      <table>
        <thead>
          <tr>
            <th>
              <SourceLanguageLabel />
            </th>
            {admin && <th>{uitext('review.sourcePattern')}</th>}
            <th>
              <TargetLanguageLabel />
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th colSpan={admin ? 3 : 2} style={{ textAlign: 'center' }}>
              {uitext('review.dates')}
            </th>
          </tr>
          {availableEraDates.map((entry) => (
            <tr key={entry.id}>
              <SourceDataCell entry={entry} />
              {admin && <SourceDataCell entry={entry} convertPatternToExample={false} />}
              <InputDataCell entry={entry} inputWidth="10em" />
            </tr>
          ))}
          <tr>
            <th colSpan={admin ? 3 : 2} style={{ textAlign: 'center' }}>
              {uitext('review.intervals')}
            </th>
          </tr>
          {eraIntervals.map((entry) => (
            <tr key={entry.id}>
              <SourceDataCell entry={entry} />
              {admin && <SourceDataCell entry={entry} convertPatternToExample={false} />}
              <InputDataCell entry={entry} inputWidth="25em" />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EraDatesReviewTable;
