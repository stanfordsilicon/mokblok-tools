import { SourceLanguageHeader } from '@settings/SourceLanguageLabel';
import { TargetLanguageHeader } from '@settings/TargetLanguageLabel';

import { matrixBy } from '@shared/setUtils';
import useInterfaceTranslation from '@shared/useInterfaceTranslation';

import { useFindDataEntriesInScope } from '../getDataEntriesForSection';
import InputDataCell from '../input/InputDataCell';
import SourceDataCell from '../SourceDataCell';

function QuartersReviewTable() {
  const { uitext } = useInterfaceTranslation();
  const findDataEntries = useFindDataEntriesInScope();
  const quarterFields = findDataEntries({ field: 'q' }).filter((f) => f.instance !== '');
  const quarterMatrix = matrixBy(
    quarterFields,
    (f) => f.variant + '-' + f.instance,
    (f) => f.length,
  );

  return (
    <table>
      <thead style={{ textAlign: 'center' }}>
        <tr>
          <SourceLanguageHeader colSpan={2} />
          <TargetLanguageHeader colSpan={2} />
        </tr>
        <tr>
          <th>{uitext('length.wide')}</th>
          <th title={uitext('length.abbreviated')}>{uitext('length.abbr')}</th>
          <th>{uitext('length.wide')}</th>
          <th title={uitext('length.abbreviated')}>{uitext('length.abbr')}</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(quarterMatrix)
          .sort((a, b) => a[0].localeCompare(b[0]))
          .map(([length, row]) => (
            <tr key={length}>
              <SourceDataCell entry={row['w']} convertPatternToExample={false} />
              <SourceDataCell entry={row['a']} convertPatternToExample={false} />
              <InputDataCell entry={row['w']} inputWidth="15em" />
              <InputDataCell entry={row['a']} inputWidth="10em" />
            </tr>
          ))}
      </tbody>
    </table>
  );
}

export default QuartersReviewTable;
