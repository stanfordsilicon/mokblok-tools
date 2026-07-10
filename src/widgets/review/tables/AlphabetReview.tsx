import React from 'react';
import { useTranslation } from 'react-i18next';

import { useDataContext } from '@data/DataContext';
import { useLinguisticsContext } from '@data/LinguisticsContext';

import SourceLanguageLabel from '@settings/SourceLanguageLabel';

import { decodeHtmlEntities } from '@shared/stringUtils';

import InputDataCell from '../InputDataCell';
import SourceDataCell from '../SourceDataCell';

const charSets = ['base', 'uppercase', 'auxiliary', 'numbers', 'punctuation'] as const;

const AlphabetReview: React.FC = () => {
  const { findDataEntries, getTranslation } = useDataContext();
  const { numberingSystems } = useLinguisticsContext();
  const alphabetFields = findDataEntries({ group: 'Alphabet' });
  const { t } = useTranslation();

  return (
    <div>
      <InferredCharacters />
      <h3>{t('review.translated')}</h3>
      <table>
        <thead>
          <tr>
            <th>{t('review.alphabet.set')}</th>
            <th>
              <SourceLanguageLabel />
            </th>
            <th>{t('review.translated')}</th>
          </tr>
        </thead>
        <tbody>
          {charSets.map((charSet) => {
            const row = alphabetFields.find((f) => f.instance === charSet);
            return (
              <tr key={charSet}>
                <td>{charSet}</td>
                <SourceDataCell entry={row} />
                <InputDataCell entry={row} inputWidth="30em" />
              </tr>
            );
          })}
        </tbody>
      </table>
      <h3>{t('review.alphabet.numberingSystem')}</h3>
      <table>
        <thead>
          <tr>
            <th>{t('review.type')}</th>
            <th>
              <SourceLanguageLabel />
            </th>
            <th>{t('review.translated')}</th>
            <th>{t('review.alphabet.digits')}</th>
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
                <SourceDataCell entry={row} />
                <InputDataCell entry={row} />
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
  const { t } = useTranslation();
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
      <h3>{t('review.alphabet.charactersByFrequency')}</h3>
      <div style={{ display: 'flex', gap: '.5em', flexWrap: 'wrap' }}>
        {Object.entries(characterHistogram || {})
          .sort(([, countA], [, countB]) => countB - countA)
          .map(([char, count]) => (
            <div key={char}>
              {char === ' ' ? t('review.alphabet.space') : char}
              <div style={{ fontWeight: 'lighter' }}>{count}</div>
            </div>
          ))}
      </div>
      <h3>{t('review.alphabet.charactersByClass')}</h3>
      <table>
        <tbody>
          <tr>
            <th>{t('review.alphabet.writingSystem')}</th>
            <td>{writingSystem}</td>
          </tr>
          <tr>
            <th>{t('review.alphabet.baseAlphabet')}</th>
            <td>{charactersBase?.join(' ')}</td>
          </tr>
          <tr>
            <th>{t('review.alphabet.uppercaseIndex')}</th>
            <td>{charactersUppercase?.join(' ')}</td>
          </tr>
          <tr>
            <th>{t('review.alphabet.auxiliary')}</th>
            <td>{charactersAuxiliary?.join(' ')}</td>
          </tr>
          <tr>
            <th>{t('review.alphabet.numbers')}</th>
            <td>{charactersNumber?.join(' ')}</td>
          </tr>
          <tr>
            <th>{t('review.alphabet.punctuation')}</th>
            <td>{charactersPunctuation?.join(' ')}</td>
            {/* Standard punctuation characters: */}
            {/* \- ‑ , ; \: ! ? . … '‘’ &quot;“” ( ) \[ \] § @ / \&amp; # % ′ ″ */}
          </tr>
          <tr>
            <th>{t('review.alphabet.other')}</th>
            <td>{charactersOther?.join(' ')}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default AlphabetReview;
