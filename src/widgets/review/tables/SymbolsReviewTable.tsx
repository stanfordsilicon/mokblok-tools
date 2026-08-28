import { DataSection } from '@data/DataSection';

import { SourceLanguageHeader } from '@settings/SourceLanguageLabel';
import { TargetLanguageHeader } from '@settings/TargetLanguageLabel';

import useInterfaceTranslation from '@shared/useInterfaceTranslation';

import { useFindDataEntriesInScope } from '../getDataEntriesForSection';
import InputDataCell from '../input/InputDataCell';
import SourceDataCell from '../SourceDataCell';

function SymbolsReviewTable() {
  const { uitext } = useInterfaceTranslation();
  const findDataEntries = useFindDataEntriesInScope();
  const symbolsWithExamples = findDataEntries({ section: DataSection.Symbols });
  const symbols = symbolsWithExamples.filter((f) => f.exampleNum === '0');
  const symbolsExamples = symbolsWithExamples.filter((f) => f.exampleNum !== '0');

  return (
    <>
      <table>
        <thead>
          <tr>
            <SourceLanguageHeader />
            <TargetLanguageHeader />
          </tr>
        </thead>
        <tbody>
          {symbolsExamples?.map((entry) => (
            <tr key={entry.id}>
              <SourceDataCell entry={entry} />
              <InputDataCell entry={entry} inputWidth="15em" />
            </tr>
          ))}
        </tbody>
      </table>
      <table>
        <thead>
          <tr>
            <th>{uitext('review.components')}</th>
            <SourceLanguageHeader />
            <TargetLanguageHeader />
          </tr>
        </thead>
        <tbody>
          {symbols?.map((entry) => (
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

export default SymbolsReviewTable;
