import { useTranslation } from 'react-i18next';

import { useDataContext } from '@data/DataContext';
import { DataSection } from '@data/DataSection';

import SourceLanguageLabel from '@settings/SourceLanguageLabel';

import InputDataCell from '../input/InputDataCell';
import SourceDataCell from '../SourceDataCell';

function TechWordsReviewTable() {
  const { t } = useTranslation();
  const { findDataEntries } = useDataContext();
  const techWords = findDataEntries({ section: DataSection.TechWords });

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
          {techWords.map((entry) => (
            <tr key={entry.instance}>
              <SourceDataCell entry={entry} />
              <InputDataCell entry={entry} inputWidth="15em" />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TechWordsReviewTable;
