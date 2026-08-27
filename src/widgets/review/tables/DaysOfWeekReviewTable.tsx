import SourceLanguageLabel from '@settings/SourceLanguageLabel';
import TargetLanguageLabel from '@settings/TargetLanguageLabel';

import { matrixBy } from '@shared/setUtils';
import useInterfaceTranslation from '@shared/useInterfaceTranslation';

import { useFindDataEntriesInScope } from '../getDataEntriesForSection';
import InputDataCell from '../input/InputDataCell';
import SourceDataCell from '../SourceDataCell';

// TODO allow for non-Sunday first day of week
const dayOfWeekOrdered = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

function DaysOfWeekReviewTable() {
  const findDataEntries = useFindDataEntriesInScope();
  const daysOfTheWeekFields = findDataEntries({ field: 'E' }).filter(
    (f) => f.length !== '' && f.instance !== '',
  );
  const daysOfTheWeekMatrix = matrixBy(
    daysOfTheWeekFields,
    (f) => f.instance,
    (f) => f.length,
  );
  const { uitext } = useInterfaceTranslation();

  return (
    <table style={{ height: 'fit-content' }}>
      <thead>
        <tr>
          <th colSpan={4} style={{ textAlign: 'center' }}>
            <SourceLanguageLabel />
          </th>
          <th colSpan={4} style={{ textAlign: 'center' }}>
            <TargetLanguageLabel />
          </th>
        </tr>
        <tr>
          <th>{uitext('length.wide')}</th>
          <th title={uitext('length.abbreviated')}>{uitext('length.abbr')}</th>
          <th>{uitext('length.short')}</th>
          <th>{uitext('length.narrow')}</th>
          <th>{uitext('length.wide')}</th>
          <th title={uitext('length.abbreviated')}>{uitext('length.abbr')}</th>
          <th>{uitext('length.short')}</th>
          <th>{uitext('length.narrow')}</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(daysOfTheWeekMatrix)
          .sort((a, b) => dayOfWeekOrdered.indexOf(a[0]) - dayOfWeekOrdered.indexOf(b[0]))
          .map(([instance, row]) => (
            <tr key={instance}>
              <SourceDataCell entry={row['w']} />
              <SourceDataCell entry={row['a']} />
              <SourceDataCell entry={row['s']} />
              <SourceDataCell entry={row['n']} />
              <InputDataCell entry={row['w']} />
              <InputDataCell entry={row['a']} />
              <InputDataCell entry={row['s']} />
              <InputDataCell entry={row['n']} />
            </tr>
          ))}
      </tbody>
    </table>
  );
}

export default DaysOfWeekReviewTable;
