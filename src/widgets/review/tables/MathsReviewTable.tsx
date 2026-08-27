import { DataSection } from '@data/DataSection';

import SourceLanguageLabel from '@settings/SourceLanguageLabel';
import TargetLanguageLabel from '@settings/TargetLanguageLabel';

import { sortBy } from '@shared/setUtils';
import useInterfaceTranslation from '@shared/useInterfaceTranslation';

import { useFindDataEntriesInScope } from '../getDataEntriesForSection';
import InputDataCell from '../input/InputDataCell';
import SourceDataCell from '../SourceDataCell';

const symbols = ['decimal', 'percentSign', 'plusSign', 'minusSign', 'multiplication', 'division'];

function MathsReviewTable() {
  const { uitext } = useInterfaceTranslation();
  const findDataEntries = useFindDataEntriesInScope();
  const maths = sortBy(
    sortBy(findDataEntries({ section: DataSection.Maths }), (a) => a.length),
    (a) => symbols.indexOf(a.instance),
  );
  const mathsSymbols = maths.filter((f) => f.exampleNum === '0');
  const mathsExamples = maths.filter((f) => f.exampleNum !== '0');

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>
              <SourceLanguageLabel />
            </th>
            <th>
              <TargetLanguageLabel />
            </th>
          </tr>
        </thead>
        <tbody>
          {mathsExamples?.map((example) => (
            <tr key={example.id}>
              <SourceDataCell entry={example} />
              <InputDataCell entry={example} inputWidth="15em" />
            </tr>
          ))}
        </tbody>
      </table>
      <table>
        <thead>
          <tr>
            <th>{uitext('review.components')}</th>
            <th>
              <SourceLanguageLabel />
            </th>
            <th>
              <TargetLanguageLabel />
            </th>
          </tr>
        </thead>
        <tbody>
          {mathsSymbols?.map((entry) => (
            <tr key={entry.id}>
              <td>
                {entry.instance} {entry.length}
              </td>
              <SourceDataCell entry={entry} />
              <InputDataCell entry={entry} inputWidth="3em" />
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default MathsReviewTable;
