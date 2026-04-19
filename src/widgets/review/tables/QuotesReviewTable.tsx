import { useDataContext } from '@data/DataContext';

import SourceLanguageLabel from '@settings/SourceLanguageLabel';

import { matrixBy, sortBy } from '@shared/setUtils';

import InputDataCell from '../InputDataCell';
import InputTextareaCell from '../InputTextareaCell';
import SourceDataCell from '../SourceDataCell';

function QuotesReviewTable() {
  const { findDataFields } = useDataContext();
  const quotes = sortBy(findDataFields({ group: 'Quotes' }), (a) => a.length);
  const quotesMatrix = matrixBy(
    quotes.filter((f) => f.exampleNum === '0'),
    (f) => f.length,
    (f) => f.instance,
  );
  const quotesExamples = quotes.filter((f) => f.exampleNum !== '0');

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
          {quotesExamples?.map((example) => (
            <tr key={example.index}>
              <SourceDataCell data={example} style={{ width: '30em', textWrap: 'auto' }} />
              <InputTextareaCell data={example} />
            </tr>
          ))}
        </tbody>
      </table>
      <table>
        <thead>
          <tr>
            <th>Length</th>
            <th colSpan={2}>
              <SourceLanguageLabel />
            </th>
            <th colSpan={2}>Translated</th>
          </tr>
          <tr>
            <th></th>
            <th>Start</th>
            <th>End</th>
            <th>Start</th>
            <th>End</th>
          </tr>
        </thead>
        <tbody>
          {['', 'n']?.map((length) => (
            <tr key={length}>
              <td>{length === '' ? 'Regular' : 'Narrow'}</td>
              <SourceDataCell data={quotesMatrix[length]['start']} />
              <SourceDataCell data={quotesMatrix[length]['end']} />
              <InputDataCell data={quotesMatrix[length]['start']} inputWidth="2em" />
              <InputDataCell data={quotesMatrix[length]['end']} inputWidth="2em" />
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default QuotesReviewTable;
