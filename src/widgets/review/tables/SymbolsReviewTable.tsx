import { useTranslation } from 'react-i18next';

import { useDataContext } from '@data/DataContext';
import { DataSection } from '@data/DataSection';

import SourceLanguageLabel from '@settings/SourceLanguageLabel';

import InputDataCell from '../InputDataCell';
import SourceDataCell from '../SourceDataCell';

function SymbolsReviewTable() {
  const { t } = useTranslation();
  const { findDataEntries } = useDataContext();
  const symbolsWithExamples = findDataEntries({ section: DataSection.Symbols });
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
            <th>{t('review.translated')}</th>
          </tr>
        </thead>
        <tbody>
          {symbolsExamples?.map((entry) => (
            <tr key={entry.index}>
              <SourceDataCell entry={entry} />
              <InputDataCell entry={entry} inputWidth="15em" />
            </tr>
          ))}
        </tbody>
      </table>
      <table>
        <thead>
          <tr>
            <th>{t('review.components')}</th>
            <th>
              <SourceLanguageLabel />
            </th>
            <th>{t('review.translated')}</th>
          </tr>
        </thead>
        <tbody>
          {symbols?.map((entry) => (
            <tr key={entry.index}>
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
