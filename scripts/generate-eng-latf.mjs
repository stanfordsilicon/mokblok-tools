import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const localesDir = path.resolve(__dirname, '../public/locales');
const sourcePath = path.join(localesDir, 'en/common.json');
const targetPath = path.join(localesDir, 'en-Latf/common.json');

const frakturMap = new Map([
  ['A', '𝔄'],
  ['B', '𝔅'],
  ['C', 'ℭ'],
  ['D', '𝔇'],
  ['E', '𝔈'],
  ['F', '𝔉'],
  ['G', '𝔊'],
  ['H', 'ℌ'],
  ['I', 'ℑ'],
  ['J', '𝔍'],
  ['K', '𝔎'],
  ['L', '𝔏'],
  ['M', '𝔐'],
  ['N', '𝔑'],
  ['O', '𝔒'],
  ['P', '𝔓'],
  ['Q', '𝔔'],
  ['R', 'ℜ'],
  ['S', '𝔖'],
  ['T', '𝔗'],
  ['U', '𝔘'],
  ['V', '𝔙'],
  ['W', '𝔚'],
  ['X', '𝔛'],
  ['Y', '𝔜'],
  ['Z', 'ℨ'],
  ['a', '𝔞'],
  ['b', '𝔟'],
  ['c', '𝔠'],
  ['d', '𝔡'],
  ['e', '𝔢'],
  ['f', '𝔣'],
  ['g', '𝔤'],
  ['h', '𝔥'],
  ['i', '𝔦'],
  ['j', '𝔧'],
  ['k', '𝔨'],
  ['l', '𝔩'],
  ['m', '𝔪'],
  ['n', '𝔫'],
  ['o', '𝔬'],
  ['p', '𝔭'],
  ['q', '𝔮'],
  ['r', '𝔯'],
  ['s', '𝔰'],
  ['t', '𝔱'],
  ['u', '𝔲'],
  ['v', '𝔳'],
  ['w', '𝔴'],
  ['x', '𝔵'],
  ['y', '𝔶'],
  ['z', '𝔷'],
]);

const identifierPattern = /[A-Za-z0-9_]/;
const selectorPattern = /[A-Za-z*]/;

const shouldPreserveSelector = (input, start) => {
  let end = start;
  while (end < input.length && selectorPattern.test(input[end])) {
    end += 1;
  }

  const token = input.slice(start, end);
  if (!token || token === '*') {
    return end;
  }

  let cursor = end;
  let spacing = 0;
  while (cursor < input.length && input[cursor] === ' ') {
    spacing += 1;
    cursor += 1;
  }

  return spacing >= 2 && input[cursor] === '{' ? end : start;
};

const transformMessage = (input) => {
  let output = '';
  let index = 0;
  let lineStart = true;
  let braceDepth = 0;

  while (index < input.length) {
    const char = input[index];

    if (char === '\n') {
      output += char;
      lineStart = true;
      index += 1;
      continue;
    }

    if (
      braceDepth === 0 &&
      input.slice(index, index + 2) === '{{' &&
      input[index + 2] !== '{'
    ) {
      const placeholderEnd = input.indexOf('}}', index + 2);
      if (placeholderEnd !== -1) {
        output += input.slice(index, placeholderEnd + 2);
        index = placeholderEnd + 2;
        lineStart = false;
        continue;
      }
    }

    if (char === '{') {
      output += char;
      braceDepth += 1;
      lineStart = false;
      index += 1;
      continue;
    }

    if (char === '}') {
      output += char;
      braceDepth = Math.max(0, braceDepth - 1);
      lineStart = false;
      index += 1;
      continue;
    }

    if (lineStart && char === '.') {
      let end = index + 1;
      while (end < input.length && identifierPattern.test(input[end])) {
        end += 1;
      }
      output += input.slice(index, end);
      index = end;
      lineStart = false;
      continue;
    }

    if (lineStart && selectorPattern.test(char)) {
      const selectorEnd = shouldPreserveSelector(input, index);
      if (selectorEnd > index) {
        output += input.slice(index, selectorEnd);
        index = selectorEnd;
        lineStart = false;
        continue;
      }
    }

    const previousChar = input[index - 1];
    const isVariableReference = char === '$';
    const isTypeOrTagIdentifier =
      braceDepth > 0 &&
      (char === ':' || ((char === '#' || char === '/') && previousChar === '{'));

    if (isVariableReference || isTypeOrTagIdentifier) {
      output += char;
      index += 1;

      while (index < input.length && identifierPattern.test(input[index])) {
        output += input[index];
        index += 1;
      }

      lineStart = false;
      continue;
    }

    output += frakturMap.get(char) ?? char;
    lineStart = false;
    index += 1;
  }

  return output;
};

const transformValue = (value) => {
  if (typeof value === 'string') {
    return transformMessage(value);
  }

  if (Array.isArray(value)) {
    return value.map(transformValue);
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => [key, transformValue(nestedValue)]),
    );
  }

  return value;
};

const source = JSON.parse(await readFile(sourcePath, 'utf8'));
const transformed = transformValue(source);
const output = `${JSON.stringify(transformed, null, 2)}\n`;

await writeFile(targetPath, output, 'utf8');
console.log(`Generated ${path.relative(process.cwd(), targetPath)} from ${path.relative(process.cwd(), sourcePath)}`);
