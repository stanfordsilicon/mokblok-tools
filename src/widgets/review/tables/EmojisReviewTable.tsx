import { useTranslation } from 'react-i18next';

import { useDataContext } from '@data/DataContext';

import SourceLanguageLabel from '@settings/SourceLanguageLabel';

import { groupBy } from '@shared/setUtils';

import InputDataCell from '../InputDataCell';
import SourceDataCell from '../SourceDataCell';

function EmojisReviewTable() {
  const { findDataEntries } = useDataContext();
  const emojisByGroup = groupBy(findDataEntries({ subject: 'emoji' }), (f) => f.group);
  const { t } = useTranslation();

  return (
    <div>
      Write the name describing the emoji -- you don't necessarily need to stay true to the source
      word, but explain what the emoji means.
      {Object.entries(emojisByGroup).map(([group, emojis]) => (
        <div key={group}>
          <h3>{group}</h3>
          <table>
            <thead>
              <tr>
                <th>{t('dataSection.emojis')}</th>
                <th>
                  <SourceLanguageLabel />
                </th>
                <th>{t('review.translated')}</th>
              </tr>
            </thead>
            <tbody>
              {emojis.map((entry) => (
                <tr key={entry.instance}>
                  <td>{entry.instance}</td>
                  <SourceDataCell entry={entry} />
                  <InputDataCell entry={entry} inputWidth="15em" />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

export default EmojisReviewTable;
