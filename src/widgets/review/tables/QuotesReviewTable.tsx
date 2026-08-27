import { DataSection } from '@data/DataSection';

import { SourceLanguageHeader } from '@settings/SourceLanguageLabel';
import { TargetLanguageHeader } from '@settings/TargetLanguageLabel';

import { matrixBy, sortBy } from '@shared/setUtils';
import useInterfaceTranslation from '@shared/useInterfaceTranslation';

import { useFindDataEntriesInScope } from '../getDataEntriesForSection';
import InputDataCell from '../input/InputDataCell';
import InputTextareaCell from '../input/InputTextareaCell';
import SourceDataCell from '../SourceDataCell';

function QuotesReviewTable() {
  const { uitext } = useInterfaceTranslation();
  const findDataEntries = useFindDataEntriesInScope();
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
            <SourceLanguageHeader />
            <TargetLanguageHeader />
          </tr>
        </thead>
        <tbody>
          {quotesExamples?.map((example) => (
            <tr key={example.id}>
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
            <SourceLanguageHeader colSpan={2} />
            <TargetLanguageHeader colSpan={2} />
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
