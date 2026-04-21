import { useDataContext } from '@data/DataContext';

import { useSettings } from '@settings/Settings';
import SourceLanguageLabel from '@settings/SourceLanguageLabel';

import InputDataCell from '../InputDataCell';
import SourceDataCell from '../SourceDataCell';

function LanguageNamesReviewTable() {
  const { targetLanguageBCP } = useSettings();
  const { findDataFields } = useDataContext();
  const languageNameFields = findDataFields({ group: 'Language Names' });
  const secondaryLanguageNameFields = findDataFields({ group: 'Secondary Language Names' });

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
            <th>Translated</th>
          </tr>
        </thead>
        <tbody>
          {languageNameFields.map((row) => (
            <tr key={row.index}>
              <SourceDataCell
                data={row}
                style={{
                  maxWidth: '20em',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              />
              <InputDataCell data={row} inputWidth="15em" />
            </tr>
          ))}
          <tr>
            <th colSpan={2} style={{ textAlign: 'center' }}>
              More Languages
            </th>
          </tr>
          {secondaryLanguageNameFields.map((row) => (
            <tr key={row.index}>
              <SourceDataCell
                data={row}
                style={{
                  maxWidth: '20em',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              />
              <InputDataCell data={row} inputWidth="15em" />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default LanguageNamesReviewTable;
