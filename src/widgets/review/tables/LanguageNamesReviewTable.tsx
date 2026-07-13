import { useTranslation } from 'react-i18next';

import { useDataContext } from '@data/DataContext';
import { DataSection } from '@data/DataSection';

import { getLanguageBCP } from '@settings/LanguageCodes';
import SourceLanguageLabel from '@settings/SourceLanguageLabel';
import { useURLParams } from '@settings/URLParams';

import InputDataCell from '../InputDataCell';
import SourceDataCell from '../SourceDataCell';

function LanguageNamesReviewTable() {
  const { t } = useTranslation();
  const targetLanguageBCP = getLanguageBCP(useURLParams().targetLanguage);
  const { findDataEntries } = useDataContext();
  const allLanguageNameFields = findDataEntries({ section: DataSection.LanguageNames });
  const languageNameFields = allLanguageNameFields.filter((f) => f.group !== 'Secondary');
  const secondaryLanguageNameFields = allLanguageNameFields.filter((f) => f.group === 'Secondary');

  // If the target language is in the secondaryLanguageNameField, move it to the main languageNameFields for review
  const ownLanguageFieldIndex = secondaryLanguageNameFields.findIndex(
    (f) => f.instance === targetLanguageBCP,
  );
  if (ownLanguageFieldIndex !== -1) {
    const [ownLanguageField] = secondaryLanguageNameFields.splice(ownLanguageFieldIndex, 1);
    languageNameFields.unshift(ownLanguageField);
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
          {languageNameFields.map((entry) => (
            <tr key={entry.index}>
              <SourceDataCell
                entry={entry}
                style={{
                  maxWidth: '20em',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              />
              <InputDataCell entry={entry} inputWidth="15em" />
            </tr>
          ))}
          <tr>
            <th colSpan={2} style={{ textAlign: 'center' }}>
              {t('review.moreLanguages')}
            </th>
          </tr>
          {secondaryLanguageNameFields.map((entry) => (
            <tr key={entry.index}>
              <SourceDataCell
                entry={entry}
                style={{
                  maxWidth: '20em',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              />
              <InputDataCell entry={entry} inputWidth="15em" />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default LanguageNamesReviewTable;
