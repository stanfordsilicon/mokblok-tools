import { useDataContext } from '@data/DataContext';
import { DataSection } from '@data/DataSection';

import SourceLanguageLabel from '@settings/SourceLanguageLabel';
import { useURLParams } from '@settings/URLParams';

import useInterfaceTranslation from '@shared/useInterfaceTranslation';

import InputDataCell from '../input/InputDataCell';
import SourceDataCell from '../SourceDataCell';

function EraDatesReviewTable() {
  const { uitext } = useInterfaceTranslation();
  const { admin } = useURLParams();
  const { findDataEntries } = useDataContext();
  const allEraFields = findDataEntries({ section: DataSection.EraDates }).filter((f) =>
    f.instance.includes('G'),
  );
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
            <th>{uitext('review.translated')}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th colSpan={admin ? 3 : 2} style={{ textAlign: 'center' }}>
              {uitext('review.dates')}
            </th>
          </tr>
          {availableEraDates.map((entry) => (
            <tr key={entry.index}>
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
            <tr key={entry.index}>
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
