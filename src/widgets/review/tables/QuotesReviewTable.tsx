import { useDataContext } from '@data/DataContext';
import { DataSection } from '@data/DataSection';

import SourceLanguageLabel from '@settings/SourceLanguageLabel';

import { matrixBy, sortBy } from '@shared/setUtils';
import useInterfaceTranslation from '@shared/useInterfaceTranslation';

import InputDataCell from '../input/InputDataCell';
import InputTextareaCell from '../input/InputTextareaCell';
import SourceDataCell from '../SourceDataCell';

function QuotesReviewTable() {
  const { uitext } = useInterfaceTranslation();
  const { findDataEntries } = useDataContext();
  const quotes = sortBy(findDataEntries({ section: DataSection.Quotes }), (a) => a.length);
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
            <th>{uitext('review.translated')}</th>
          </tr>
        </thead>
        <tbody>
          {quotesExamples?.map((example) => (
            <tr key={example.index}>
              <SourceDataCell entry={example} style={{ width: '30em', textWrap: 'auto' }} />
              <InputTextareaCell entry={example} />
            </tr>
          ))}
        </tbody>
      </table>
      <table>
        <thead>
          <tr>
            <th>{uitext('review.length')}</th>
            <th colSpan={2}>
              <SourceLanguageLabel />
            </th>
            <th colSpan={2}>{uitext('review.translated')}</th>
          </tr>
          <tr>
            <th></th>
            <th>{uitext('review.start')}</th>
            <th>{uitext('review.end')}</th>
            <th>{uitext('review.start')}</th>
            <th>{uitext('review.end')}</th>
          </tr>
        </thead>
        <tbody>
          {['', 'n']?.map((length) => (
            <tr key={length}>
              <td>{length === '' ? 'Regular' : 'Narrow'}</td>
              <SourceDataCell entry={quotesMatrix[length]?.['start']} />
              <SourceDataCell entry={quotesMatrix[length]?.['end']} />
              <InputDataCell entry={quotesMatrix[length]?.['start']} inputWidth="2em" />
              <InputDataCell entry={quotesMatrix[length]?.['end']} inputWidth="2em" />
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default QuotesReviewTable;
