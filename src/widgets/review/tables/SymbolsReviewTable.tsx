import { useDataContext } from '@data/DataContext';

import SourceLanguageLabel from '@settings/SourceLanguageLabel';

import InputDataCell from '../InputDataCell';
import SourceDataCell from '../SourceDataCell';

function SymbolsReviewTable() {
  const { findDataFields } = useDataContext();
  const symbolsWithExamples = findDataFields({ group: 'Symbols', field: 'symbols' });
  const symbols = symbolsWithExamples.filter((f) => f.exampleNum === '0');
  const symbolsExamples = symbolsWithExamples.filter((f) => f.exampleNum !== '0');

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>
              <SourceLanguageLabel />
            </th>
            <th>Translated</th>
          </tr>
        </thead>
        <tbody>
          {symbolsExamples?.map((example) => (
            <tr key={example.index}>
              <SourceDataCell data={example} />
              <InputDataCell data={example} inputWidth="15em" />
            </tr>
          ))}
        </tbody>
      </table>
      <table>
        <thead>
          <tr>
            <th>Components</th>
            <th>
              <SourceLanguageLabel />
            </th>
            <th>Translated</th>
          </tr>
        </thead>
        <tbody>
          {symbols?.map((datum) => (
            <tr key={datum.index}>
              <td>
                {datum.instance} {datum.length}
              </td>
              <SourceDataCell data={datum} />
              <InputDataCell data={datum} inputWidth="3em" />
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default SymbolsReviewTable;
