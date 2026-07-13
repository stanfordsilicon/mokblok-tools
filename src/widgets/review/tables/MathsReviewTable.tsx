import { useTranslation } from 'react-i18next';

import { useDataContext } from '@data/DataContext';
import { DataSection } from '@data/DataSection';

import SourceLanguageLabel from '@settings/SourceLanguageLabel';

import { sortBy } from '@shared/setUtils';

import InputDataCell from '../InputDataCell';
import SourceDataCell from '../SourceDataCell';

const symbols = ['decimal', 'percentSign', 'plusSign', 'minusSign', 'multiplication', 'division'];

function MathsReviewTable() {
  const { t } = useTranslation();
  const { findDataEntries } = useDataContext();
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
            <th>{t('review.translated')}</th>
          </tr>
        </thead>
        <tbody>
          {mathsExamples?.map((example) => (
            <tr key={example.index}>
              <SourceDataCell entry={example} />
              <InputDataCell entry={example} inputWidth="15em" />
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
          {mathsSymbols?.map((entry) => (
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

export default MathsReviewTable;
