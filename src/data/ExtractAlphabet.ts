import type { AlphabetData, RowData } from './DataTypes';

const IGNORED_TITLES = ['YOUR ANSWER', 'TRANSLATION IN YOUR LANGUAGE'];
const IGNORED_WORDS = ['ไทย', '中文']; // From example text
const IGNORED_CHARS = [' ', '\u00A0' /* non-breaking space */];

function extractAlphabetData(rows: RowData[]): AlphabetData {
  const characterHistogram = rows.reduce(
    (acc, row) => {
      let text = row.translated?.normalize('NFC').trim();
      if (!text || IGNORED_TITLES.includes(text)) return acc;
      IGNORED_WORDS.forEach((word) => {
        text = text.replaceAll(word, '');
      });
      const chars = text.split('');
      chars.forEach((char) => {
        if (IGNORED_CHARS.includes(char)) return;
        acc[char] = (acc[char] || 0) + 1;
      });
      return acc;
    },
    {} as Record<string, number>,
  );

  const writingSystem = getWritingSystem(characterHistogram);

  // Extract Number & Punctuation characters
  const charactersNumber = Object.keys(characterHistogram)
    .filter((char) => /\d/.test(char))
    .sort();
  const charactersPunctuation = Object.keys(characterHistogram)
    .filter((char) => isPunctuation(char))
    .sort();
  const charactersOther = Object.keys(characterHistogram)
    .filter((char) => isOtherCharacter(char, writingSystem))
    .sort();

  Object.keys(characterHistogram).forEach((char) => {
    if (charactersNumber.includes(char) || isPunctuation(char) || charactersOther.includes(char)) {
      delete characterHistogram[char];
    }
  });

  // All others are base
  const charactersBase = Object.keys(characterHistogram).sort();

  const alphabetData: AlphabetData = {
    characterHistogram,
    charactersAuxiliary: [],
    charactersPunctuation,
    charactersBase,
    charactersOther,
    charactersNumber,
    writingSystem,
  };
  return alphabetData;
}

function getWritingSystem(characterHistogram: Record<string, number>): string {
  // Group characters in the histogram by Unicode script and check which script is most represented
  const charGroupFrequencies: Record<string, number> = Object.entries(characterHistogram).reduce(
    (acc, [char, count]) => {
      const script = getCharacterScript(char);
      acc[script] = (acc[script] || 0) + count;
      return acc;
    },
    {} as Record<string, number>,
  );

  return Object.entries(charGroupFrequencies).reduce(
    (mostFrequent, [script, count]) => {
      if (count > mostFrequent.count) {
        return { script, count };
      }
      return mostFrequent;
    },
    { script: 'Unknown', count: 0 },
  ).script;
}

function getCharacterScript(char: string): string {
  if (/\p{Script=Latin}/u.test(char)) return 'Latin';
  if (/\p{Script=Cyrillic}/u.test(char)) return 'Cyrillic';
  if (/\p{Script=Arabic}/u.test(char)) return 'Arabic';
  if (/\p{Script=Devanagari}/u.test(char)) return 'Devanagari';
  // Add more scripts as needed
  return 'Unknown';
}

function isPunctuation(char: string): boolean {
  return /\p{P}/u.test(char);
}

function isOtherCharacter(char: string, writingSystem: string): boolean {
  if (['°'].includes(char)) return true;
  if (writingSystem !== 'Latin') {
    return /\p{Script=Latin}/u.test(char);
  }
  return false;
  //   return !/\p{L}/u.test(char) && !/\p{N}/u.test(char) && !/\p{P}/u.test(char) && char !== ' ';
}

export default extractAlphabetData;
