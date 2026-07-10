import { useTranslation } from 'react-i18next';

import { useDataContext } from '@data/DataContext';

import SourceLanguageLabel from '@settings/SourceLanguageLabel';

import { groupBy } from '@shared/setUtils';

import InputTextareaCell from '../InputTextareaCell';
import SourceDataCell from '../SourceDataCell';

function ParagraphsReviewTable() {
  const { t } = useTranslation();
  const { findDataEntries } = useDataContext();
  const paragraphsByGroup = groupBy(findDataEntries({ group: 'Paragraphs' }), (f) => f.field);

  function getHeight(english: string) {
    return Math.max(english.length / 50, 1.5) + 'em';
  }

  return (
    <div>
      {Object.entries(paragraphsByGroup).map(([group, paragraphs]) => (
        <div key={group}>
          <h3>{group}</h3>
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
              {paragraphs.map((entry) => (
                <tr key={entry.instance}>
                  <SourceDataCell entry={entry} style={{ textWrap: 'balance' }} />
                  <InputTextareaCell
                    entry={entry}
                    style={{ height: getHeight(entry.english), width: '50em' }}
                  />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

export default ParagraphsReviewTable;
