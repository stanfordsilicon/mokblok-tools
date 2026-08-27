import React from 'react';

import { DataSection } from '@data/DataSection';
import { useLinguisticsContext } from '@data/LinguisticsContext';
import { useTargetDataContext } from '@data/target/TargetDataProvider';

import { SourceLanguageHeader } from '@settings/SourceLanguageLabel';
import TargetLanguageLabel, { TargetLanguageHeader } from '@settings/TargetLanguageLabel';

import { decodeHtmlEntities } from '@shared/stringUtils';
import useInterfaceTranslation from '@shared/useInterfaceTranslation';

import { useFindDataEntriesInScope } from '../getDataEntriesForSection';
import InputDataCell from '../input/InputDataCell';
import SourceDataCell from '../SourceDataCell';

const charSets = ['main', 'uppercase', 'auxiliary', 'numbers', 'punctuation'] as const;

const AlphabetReview: React.FC = () => {
  const { uitext } = useInterfaceTranslation();
  const findDataEntries = useFindDataEntriesInScope();
  const { getTranslation } = useTargetDataContext();
  const { numberingSystems } = useLinguisticsContext();
  const alphabetFields = findDataEntries({ section: DataSection.Alphabet });

  return (
    <div>
      <InferredCharacters />
      <h3>
        <TargetLanguageLabel />
      </h3>
      <table>
        <thead>
          <tr>
            <th>{uitext('review.alphabet.set')}</th>
            <SourceLanguageHeader />
            <TargetLanguageHeader />
          </tr>
        </thead>
        <tbody>
          {charSets.map((charSet) => {
            const row = alphabetFields.find((f) => f.instance === charSet);
            return (
              <tr key={charSet}>
                <td>{uitext(`review.alphabet.${charSet}`)}</td>
                <SourceDataCell entry={row} />
                <InputDataCell entry={row} inputWidth="30em" />
              </tr>
            );
          })}
        </tbody>
      </table>
      <h3>{uitext('review.alphabet.numberingSystem')}</h3>
      <table>
        <thead>
          <tr>
            <th>{uitext('review.type')}</th>
            <SourceLanguageHeader />
            <TargetLanguageHeader />
            <th>{uitext('review.alphabet.digits')}</th>
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
  const { uitext } = useInterfaceTranslation();
  const {
    characterHistogram,
    charactersNumber,
    charactersAuxiliary,
    charactersBase,
    charactersPunctuation,
    charactersUppercase,
    charactersOther,
    writingSystem,
  } = useTargetDataContext().alphabet || {};
  const hasHistogram = characterHistogram != null && Object.keys(characterHistogram).length > 0;

  return (
    <div>
      {hasHistogram && <h3>{uitext('review.alphabet.charactersByFrequency')}</h3>}
      {hasHistogram && (
        <div style={{ display: 'flex', gap: '.5em', flexWrap: 'wrap' }}>
          {Object.entries(characterHistogram)
            .sort(([, countA], [, countB]) => countB - countA)
            .map(([char, count]) => (
              <div key={char}>
                {char === ' ' ? uitext('review.alphabet.space') : char}
                <div style={{ fontWeight: 'lighter' }}>{count}</div>
              </div>
            ))}
        </div>
      )}
      <h3>{uitext('review.alphabet.charactersByClass')}</h3>
      <table>
        <tbody>
          <tr>
            <th>{uitext('review.alphabet.writingSystem')}</th>
            <td>{writingSystem}</td>
          </tr>
          <tr>
            <th>{uitext('review.alphabet.main')}</th>
            <td>{charactersBase?.join(' ')}</td>
          </tr>
          <tr>
            <th>{uitext('review.alphabet.uppercase')}</th>
            <td>{charactersUppercase?.join(' ')}</td>
          </tr>
          <tr>
            <th>{uitext('review.alphabet.auxiliary')}</th>
            <td>{charactersAuxiliary?.join(' ')}</td>
          </tr>
          <tr>
            <th>{uitext('review.alphabet.numbers')}</th>
            <td>{charactersNumber?.join(' ')}</td>
          </tr>
          <tr>
            <th>{uitext('review.alphabet.punctuation')}</th>
            <td>{charactersPunctuation?.join(' ')}</td>
            {/* Standard punctuation characters: */}
            {/* \- ‑ , ; \: ! ? . … '‘’ &quot;“” ( ) \[ \] § @ / \&amp; # % ′ ″ */}
          </tr>
          <tr>
            <th>{uitext('review.alphabet.other')}</th>
            <td>{charactersOther?.join(' ')}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default AlphabetReview;
