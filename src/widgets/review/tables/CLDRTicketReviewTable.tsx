import { useTranslation } from 'react-i18next';

import { useDataContext } from '@data/DataContext';

import SourceLanguageLabel from '@settings/SourceLanguageLabel';

import InputTextareaCell from '../InputTextareaCell';
import SourceDataCell from '../SourceDataCell';

function CLDRTicketReviewTable() {
  const { findDataEntries } = useDataContext();
  const sentences = findDataEntries({ group: 'CLDR Ticket' });
  const { t } = useTranslation();

  function getHeight(english: string) {
    return Math.max(english.length / 50, 1.5) + 'em';
  }

  return (
    <div>
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
          {sentences.map((sentence) => (
            <tr key={sentence.instance}>
              <SourceDataCell entry={sentence} style={{ textWrap: 'balance' }} />
              <InputTextareaCell
                entry={sentence}
                style={{ height: getHeight(sentence.english), width: '50em' }}
              />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CLDRTicketReviewTable;
