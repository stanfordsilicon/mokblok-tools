import React from 'react';

import { useDataContext } from '@data/DataContext';

const AlphabetReview: React.FC = () => {
  const {
    characterHistogram,
    charactersNumber,
    charactersAuxiliary,
    charactersBase,
    charactersPunctuation,
    charactersUppercase,
    charactersOther,
    writingSystem,
  } = useDataContext().alphabetData || {};
  return (
    <div>
      <h2>Alphabet Review</h2>
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
