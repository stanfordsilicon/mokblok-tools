import { SourceLanguageHeader } from '@settings/SourceLanguageLabel';
import { TargetLanguageHeader } from '@settings/TargetLanguageLabel';
import { useURLParams } from '@settings/URLParams';

import { matrixBy } from '@shared/setUtils';
import useInterfaceTranslation from '@shared/useInterfaceTranslation';

import { useFindDataEntriesInScope } from '../getDataEntriesForSection';
import InputDataCell from '../input/InputDataCell';
import SourceDataCell from '../SourceDataCell';

function ErasReviewTable() {
  const { uitext } = useInterfaceTranslation();
  const { admin } = useURLParams();
  const findDataEntries = useFindDataEntriesInScope();
  const eraFields = findDataEntries({ field: 'G' });
  const eraMatrix = matrixBy(
    eraFields,
    (f) => f.instance + f.variant,
    (f) => f.length,
  );

  return (
    <table>
      <thead style={{ textAlign: 'center' }}>
        <tr>
          <SourceLanguageHeader colSpan={admin ? 3 : 2} />
          <TargetLanguageHeader colSpan={admin ? 3 : 2} />
        </tr>
        <tr>
          <th>{uitext('length.wide')}</th>
          <th>{uitext('length.abbr')}</th>
          {admin && <th>{uitext('length.narrow')}</th>}
          <th>{uitext('length.wide')}</th>
          <th>{uitext('length.abbr')}</th>
          {admin && <th>{uitext('length.narrow')}</th>}
        </tr>
      </thead>
      <tbody>
        {Object.entries(eraMatrix)
          .sort((a, b) => a[0].localeCompare(b[0]))
          .map(([instance, row]) => (
            <tr key={instance}>
              <SourceDataCell entry={row['w']} />
              <SourceDataCell entry={row['a']} />
              {admin && <SourceDataCell entry={row['n']} />}
              <InputDataCell entry={row['w']} inputWidth="10em" />
              <InputDataCell entry={row['a']} inputWidth="4em" />
              {admin && <InputDataCell entry={row['n']} inputWidth="4em" />}
            </tr>
          ))}
      </tbody>
    </table>
  );
}

export default ErasReviewTable;
