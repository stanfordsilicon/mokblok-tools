import { DataSection } from '@data/DataSection';
import { DateField } from '@data/DateField';

import { SourceLanguageHeader } from '@settings/SourceLanguageLabel';
import { TargetLanguageHeader } from '@settings/TargetLanguageLabel';
import { useURLParams } from '@settings/URLParams';

import { matrixBy } from '@shared/setUtils';
import useInterfaceTranslation from '@shared/useInterfaceTranslation';

import { useFindDataEntriesInScope } from '../getDataEntriesForSection';
import InputDataCell from '../input/InputDataCell';
import SourceDataCell from '../SourceDataCell';

function RelativeTimeReviewTable() {
  const { uitext } = useInterfaceTranslation();
  const { admin } = useURLParams();
  const findDataEntries = useFindDataEntriesInScope();
  const relativeTimeFields = findDataEntries({ section: DataSection.RelativeTime }).filter(
    (f) => ['-1', '0', '1'].includes(f.instance) && f.length === '',
  );
  const relativeTimeMatrix = matrixBy(
    relativeTimeFields,
    (f) => f.field,
    (f) => f.instance,
  );

  return (
    <table>
      <thead>
        <tr>
          {admin && <th>{uitext('review.field')}</th>}
          <SourceLanguageHeader colSpan={3} className="text-center" />
          <TargetLanguageHeader colSpan={3} className="text-center" />
        </tr>
        <tr>
          <th></th>
          <th>{uitext('review.past')}</th>
          <th>{uitext('review.present')}</th>
          <th>{uitext('review.future')}</th>
          <th>{uitext('review.past')}</th>
          <th>{uitext('review.present')}</th>
          <th>{uitext('review.future')}</th>
        </tr>
      </thead>
      <tbody>
        {Object.values(DateField).map((field) => {
          const row = relativeTimeMatrix[field];
          if (!row) return null;
          return (
            <tr key={field}>
              {admin && <td>{field}</td>}
              <SourceDataCell entry={row['-1']} />
              <SourceDataCell entry={row['0']} />
              <SourceDataCell entry={row['1']} />
              <InputDataCell entry={row['-1']} inputWidth="10em" />
              <InputDataCell entry={row['0']} inputWidth="10em" />
              <InputDataCell entry={row['1']} inputWidth="10em" />
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default RelativeTimeReviewTable;
