import SourceLanguageLabel from '@settings/SourceLanguageLabel';

import { matrixBy } from '@shared/setUtils';
import useInterfaceTranslation from '@shared/useInterfaceTranslation';

import { useFindDataEntriesInScope } from '../getDataEntriesForSection';
import InputDataCell from '../input/InputDataCell';
import SourceDataCell from '../SourceDataCell';

function MonthsReviewTable() {
  const { uitext } = useInterfaceTranslation();
  const findDataEntries = useFindDataEntriesInScope();
  const monthFields = findDataEntries({ field: 'M' }).filter(
    (f) => f.length !== '' && f.instance !== '',
  );
  const monthMatrix = matrixBy(
    monthFields,
    (f) => f.instance,
    (f) => f.length,
  );

  return (
    <table>
      <thead>
        <tr>
          <th colSpan={3} style={{ textAlign: 'center' }}>
            <SourceLanguageLabel />
          </th>
          <th colSpan={3} style={{ textAlign: 'center' }}>
            {uitext('review.translated')}
          </th>
        </tr>
        <tr>
          <th>{uitext('length.wide')}</th>
          <th title={uitext('length.abbreviated')}>{uitext('length.abbr')}</th>
          <th>{uitext('length.narrow')}</th>
          <th>{uitext('length.wide')}</th>
          <th title={uitext('length.abbreviated')}>{uitext('length.abbr')}</th>
          <th>{uitext('length.narrow')}</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(monthMatrix)
          .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
          .map(([length, row]) => (
            <tr key={length}>
              <SourceDataCell entry={row['w']} />
              <SourceDataCell entry={row['a']} />
              <SourceDataCell entry={row['n']} />
              <InputDataCell entry={row['w']} />
              <InputDataCell entry={row['a']} />
              <InputDataCell entry={row['n']} />
            </tr>
          ))}
      </tbody>
    </table>
  );
}

export default MonthsReviewTable;
