import React from 'react';

import { useDataContext } from '@data/DataContext';
import { useLinguisticsContext } from '@data/LinguisticsContext';

import SourceLanguageLabel from '@settings/SourceLanguageLabel';

import { decodeHtmlEntities } from '@shared/stringUtils';

import InputDataCell from '../InputDataCell';
import SourceDataCell from '../SourceDataCell';

const charSets = ['base', 'uppercase', 'auxiliary', 'numbers', 'punctuation'] as const;

const AlphabetReview: React.FC = () => {
  const { findDataFields, getTranslation } = useDataContext();
  const { numberingSystems } = useLinguisticsContext();
  console.log('numberingSystems', numberingSystems);
  const alphabetFields = findDataFields({ group: 'Alphabet' });

  return (
    <div>
      <InferredCharacters />
      <h3>Translated</h3>
      <table>
        <thead>
          <tr>
            <th>Set</th>
            <th>
              <SourceLanguageLabel />
            </th>
            <th>Translated</th>
          </tr>
        </thead>
        <tbody>
          {charSets.map((charSet) => {
            const row = alphabetFields.find((f) => f.instance === charSet);
            return (
              <tr key={charSet}>
                <td>{charSet}</td>
                <SourceDataCell data={row} />
                <InputDataCell data={row} inputWidth="30em" />
              </tr>
            );
          })}
        </tbody>
      </table>
      <h3>Numbering System</h3>
      <table>
        <thead>
          <tr>
            <th>Type</th>
            <th>
              <SourceLanguageLabel />
            </th>
            <th>Translated</th>
            <th>Digits</th>
          </tr>
        </thead>
        <tbody>
          {['default', 'native'].map((instance) => {
            const row = alphabetFields.find(
              (f) => f.field === 'numberingSystem' && f.instance === instance,
            );
            return (
              <tr key={instance}>
                <td>{instance}</td>
                <SourceDataCell data={row} />
                <InputDataCell data={row} />
                <td>{decodeHtmlEntities(numberingSystems?.[getTranslation(row)]?.digits || '')}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const InferredCharacters: React.FC = () => {
  const {
    characterHistogram,
    charactersNumber,
    charactersAuxiliary,
    charactersBase,
    charactersPunctuation,
    charactersUppercase,
    charactersOther,
    writingSystem,
  } = useDataContext().alphabet || {};

  return (
    <div>
      <h3>Characters by frequency</h3>
      <div style={{ display: 'flex', gap: '.5em', flexWrap: 'wrap' }}>
        {Object.entries(characterHistogram || {})
          .sort(([, countA], [, countB]) => countB - countA)
          .map(([char, count]) => (
            <div key={char}>
              {char === ' ' ? '[space]' : char}
              <div style={{ fontWeight: 'lighter' }}>{count}</div>
            </div>
          ))}
      </div>
      <h3>Characters by class</h3>
      <table>
        <tbody>
          <tr>
            <th>Writing System</th>
            <td>{writingSystem}</td>
          </tr>
          <tr>
            <th>Base Alphabet</th>
            <td>{charactersBase?.join(' ')}</td>
          </tr>
          <tr>
            <th>Uppercase (Index)</th>
            <td>{charactersUppercase?.join(' ')}</td>
          </tr>
          <tr>
            <th>Auxiliary</th>
            <td>{charactersAuxiliary?.join(' ')}</td>
          </tr>
          <tr>
            <th>Numbers</th>
            <td>{charactersNumber?.join(' ')}</td>
          </tr>
          <tr>
            <th>Punctuation</th>
            <td>{charactersPunctuation?.join(' ')}</td>
            {/* Standard punctuation characters: */}
            {/* \- ‑ , ; \: ! ? . … '‘’ &quot;“” ( ) \[ \] § @ / \&amp; # % ′ ″ */}
          </tr>
          <tr>
            <th>Other</th>
            <td>{charactersOther?.join(' ')}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default AlphabetReview;
