import { DataSection } from '@data/DataSection';
import { DateField } from '@data/DateField';

import { SourceLanguageHeader } from '@settings/SourceLanguageLabel';
import { TargetLanguageHeader } from '@settings/TargetLanguageLabel';

import { matrixBy } from '@shared/setUtils';
import useInterfaceTranslation from '@shared/useInterfaceTranslation';

import { useFindDataEntriesInScope } from '../getDataEntriesForSection';
import InputDataCell from '../input/InputDataCell';
import SourceDataCell from '../SourceDataCell';

const DateFieldsReviewTable: React.FC = () => {
  const findDataEntries = useFindDataEntriesInScope();
  const dateFields = findDataEntries({ section: DataSection.DateFields, exampleNum: '0' });
  const dateFieldMatrix = matrixBy(
    dateFields,
    (f) => f.field,
    (f) => f.length,
  );
  const { uitext } = useInterfaceTranslation();

  return (
    <table>
      <thead>
        <tr>
          <SourceLanguageHeader colSpan={3} className="text-center" />
          <TargetLanguageHeader colSpan={3} className="text-center" />
        </tr>
        <tr>
          <th>{uitext('length.wide')}</th>
          <th>{uitext('length.short')}</th>
          <th>{uitext('length.narrow')}</th>
          <th>{uitext('length.wide')}</th>
          <th>{uitext('length.short')}</th>
          <th>{uitext('length.narrow')}</th>
        </tr>
      </thead>
      <tbody>
        {Object.values(DateField)
          .map((field) => dateFieldMatrix[field])
          .filter((row) => !!row) // Remove rows with no data
          .map((row, index) => (
            <tr key={index}>
              <SourceDataCell entry={row['w']} />
              <SourceDataCell entry={row['s']} />
              <SourceDataCell entry={row['n']} />
              <InputDataCell entry={row['w']} />
              <InputDataCell entry={row['s']} />
              <InputDataCell entry={row['n']} />
            </tr>
          ))}
      </tbody>
    </table>
  );
};

export default DateFieldsReviewTable;
