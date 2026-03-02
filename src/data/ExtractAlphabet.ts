import type { AlphabetData, RowData } from './DataTypes';

const IGNORED_TITLES = ['YOUR ANSWER', 'TRANSLATION IN YOUR LANGUAGE'];
const IGNORED_WORDS = ['ไทย', '中文']; // From example text
const IGNORED_CHARS = [' ', '\u00A0' /* non-breaking space */];

function extractAlphabetData(rows: RowData[], extraText: string): AlphabetData {
  const characterHistogram = rows.reduce(
    (acc, row) => countCharacters(acc, row.translated || ''),
    {} as Record<string, number>,
  );
  // Add extra text
  countCharacters(characterHistogram, extraText.normalize('NFC').trim());

  const writingSystem = getWritingSystem(characterHistogram);

  // Extract Number & Punctuation characters
  const charactersNumber = Object.keys(characterHistogram)
    .filter((char) => /\d/.test(char))
    .sort();
  const charactersPunctuation = Object.keys(characterHistogram)
    .filter((char) => isPunctuation(char))
    .sort();
  const charactersOther = Object.keys(characterHistogram)
    .filter((char) => !isPunctuation(char) && isOtherCharacter(char, writingSystem))
    .sort();
  [...charactersNumber, ...charactersPunctuation, ...charactersOther].forEach((char) => {
    delete characterHistogram[char];
  });

  // Extract uppercase characters and delete them but add their counts to the lowercase version
  const charactersUppercase = Object.keys(characterHistogram)
    .filter((char) => char.toUpperCase() === char && char.toLowerCase() !== char)
    .sort();
  charactersUppercase.forEach((char) => {
    const lowercaseChar = char.toLowerCase();
    if (characterHistogram[lowercaseChar]) {
      characterHistogram[lowercaseChar] += characterHistogram[char];
    }
    delete characterHistogram[char];
  });

  // All others are base
  const charactersBase = Object.keys(characterHistogram).sort();

  const alphabetData: AlphabetData = {
    characterHistogram,
    charactersAuxiliary: [],
    charactersUppercase,
    charactersPunctuation,
    charactersBase,
    charactersOther,
    charactersNumber,
    writingSystem,
  };
  return alphabetData;
}

function countCharacters(acc: Record<string, number>, text: string): Record<string, number> {
  text = text.normalize('NFC').trim();
  if (!text || IGNORED_TITLES.includes(text)) return acc;
  IGNORED_WORDS.forEach((word) => {
    text = text.replaceAll(word, '');
  });
  const chars = text.split('');
  chars.forEach((char) => {
    if (IGNORED_CHARS.includes(char)) return;
    if (/\p{Emoji}/u.test(char)) return;
    acc[char] = (acc[char] || 0) + 1;
  });
  return acc;
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
  // Remove characters for other writing systems
  if (/\p{Script=Latin}/u.test(char)) return writingSystem !== 'Latin';
  if (/\p{Script=Cyrillic}/u.test(char)) return writingSystem !== 'Cyrillic';
  if (/\p{Script=Arabic}/u.test(char)) return writingSystem !== 'Arabic';
  if (/\p{Script=Devanagari}/u.test(char)) return writingSystem !== 'Devanagari';
  return true; // Unknown
  //   return !/\p{L}/u.test(char) && !/\p{N}/u.test(char) && !/\p{P}/u.test(char) && char !== ' ';
}

export default extractAlphabetData;
