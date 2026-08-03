import type { AlphabetData } from './DataTypes';

function extractAlphabetFromXML(xmlData: Record<string, string>): AlphabetData {
  // Implementation goes here
  return {
    characterHistogram: {},
    charactersBase: parseExemplarArray(xmlData['//ldml/characters/exemplarCharacters']),
    charactersUppercase: parseExemplarArray(
      xmlData['//ldml/characters/exemplarCharacters[@type="index"]'],
    ),
    charactersAuxiliary: parseExemplarArray(
      xmlData['//ldml/characters/exemplarCharacters[@type="auxiliary"]'],
    ),
    charactersNumber: parseExemplarArray(
      xmlData['//ldml/characters/exemplarCharacters[@type="numbers"]'],
    ),
    charactersPunctuation: parseExemplarArray(
      xmlData['//ldml/characters/exemplarCharacters[@type="punctuation"]'],
    ),
    charactersOther: [],
    writingSystem: 'Latn',
  };
}

function parseExemplarArray(exemplarString: string): string[] {
  if (!exemplarString) return [];
  return exemplarString.replace(/[{}\s]/g, '').split('');
}

export default extractAlphabetFromXML;
