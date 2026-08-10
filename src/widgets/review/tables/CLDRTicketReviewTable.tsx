import { useDataContext } from '@data/DataContext';
import { DataSection } from '@data/DataSection';

import SourceLanguageLabel from '@settings/SourceLanguageLabel';

import useInterfaceTranslation from '@shared/useInterfaceTranslation';

import InputTextareaCell from '../input/InputTextareaCell';
import SourceDataCell from '../SourceDataCell';

function CLDRTicketReviewTable() {
  const { findDataEntries } = useDataContext();
  const sentences = findDataEntries({ section: DataSection.CLDRTicket });
  const { uitext } = useInterfaceTranslation();

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
            <th>{uitext('review.translated')}</th>
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
