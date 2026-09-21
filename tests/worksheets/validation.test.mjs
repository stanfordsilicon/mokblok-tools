import assert from 'node:assert/strict';
import test from 'node:test';
import {
  validateWorksheet,
  worksheetParsingText,
} from '../../src/data/worksheets/validateWorksheet.ts';
import {
  MAX_WORKSHEET_BYTES,
  normalizeWorksheetLanguage,
} from '../../src/data/worksheets/storageTypes.ts';

const valid = 'id\tENGLISH\tTRANSLATION IN YOUR LANGUAGE\nkey\tHello\tBonjour\n';
test('valid worksheet, missing translations, multiline notes, optional notes', () => {
  assert.equal(validateWorksheet(valid, '2_2').valid, true);
  assert.equal(validateWorksheet(valid.replace('Bonjour', ''), '2_2').warnings.length, 1);
  const multiline =
    'id\tENGLISH\tTRANSLATION IN YOUR LANGUAGE\tNOTES\nkey\tHello\tBonjour\t"line one\nline two"\n';
  assert.equal(validateWorksheet(multiline, '2_2').parsedRowCount, 1);
  assert.equal(validateWorksheet('\uFEFF' + valid.replaceAll('\n', '\r\n'), '2_2').valid, true);
});
test('reject empty, malformed, wrong layout, oversized and invalid text', () => {
  for (const content of [
    '',
    'not a worksheet',
    valid.replace('ENGLISH', 'WRONG'),
    valid.replace('key\tHello\tBonjour', 'key'),
  ]) {
    assert.equal(validateWorksheet(content, '2_2').valid, false);
  }
  assert.equal(validateWorksheet(valid, '1').valid, false);
  assert.equal(validateWorksheet(valid.replace('Bonjour', '"unterminated'), '2_2').valid, false);
  assert.equal(validateWorksheet('x'.repeat(MAX_WORKSHEET_BYTES + 1), '3').valid, false);
  assert.equal(validateWorksheet('\ud800', '4').valid, false);
  assert.equal(validateWorksheet('An emoji: 😀', '4').valid, true);
});
test('normalizes only the parsing view and language lookup', () => {
  assert.equal(worksheetParsingText('\uFEFFa\r\nb\rc'), 'a\nb\nc');
  assert.equal(normalizeWorksheetLanguage(' sr-Latn '), 'sr-latn');
  assert.throws(() => normalizeWorksheetLanguage('../kri'));
  assert.throws(() => normalizeWorksheetLanguage('und'));
});
test('worksheet formats validate without depending on migrated source files', () => {
  const samples = {
    1: 'English\tFrench\tTranslation\tNotes\text_id\txpath\nHello\tBonjour\tKrio\t\tkey\t//ldml/example\n',
    '2_1': 'id\tENGLISH\tFRENCH\tTRANSLATION IN YOUR LANGUAGE\nkey\tHello\tBonjour\tKrio\n',
    '2_2': valid,
    '2_3': 'GEOGRAPHIC NAMES\nCountry\tPays\tTranslation\t\t//ldml/example\n',
    3: 'Alphabet notes',
    4: 'Additional notes',
  };
  for (const [key, content] of Object.entries(samples)) {
    const result = validateWorksheet(content, key);
    assert.equal(result.valid, true, `${key}: ${result.errors.join('; ')}`);
  }
});
