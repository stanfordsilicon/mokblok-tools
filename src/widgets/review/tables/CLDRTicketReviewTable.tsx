import { useDataContext } from '@data/DataContext';

import SourceLanguageLabel from '@settings/SourceLanguageLabel';

import InputTextareaCell from '../InputTextareaCell';
import SourceDataCell from '../SourceDataCell';

function CLDRTicketReviewTable() {
  const { findDataFields } = useDataContext();
  const sentences = findDataFields({ group: 'CLDR Ticket' });

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
            <th>Translated</th>
          </tr>
        </thead>
        <tbody>
          {sentences.map((sentence) => (
            <tr key={sentence.instance}>
              <SourceDataCell data={sentence} style={{ textWrap: 'balance' }} />
              <InputTextareaCell
                data={sentence}
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
