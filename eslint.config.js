import js from '@eslint/js';
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import prettierConfig from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import prettierPlugin from 'eslint-plugin-prettier';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import { createRequire } from 'node:module';
import tseslint from 'typescript-eslint';

const require = createRequire(import.meta.url);
const typescriptImportResolver = require.resolve(
  './node_modules/eslint-config-next/node_modules/eslint-import-resolver-typescript/lib/index.cjs',
);
const nextCoreWebVitalsWithoutImportResolver = nextCoreWebVitals.map((config) => {
  if (!config.settings?.['import/resolver']) {
    return config;
  }

  return {
    ...config,
    settings: {
      ...config.settings,
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
    },
  };
});

export default defineConfig([
  ...nextCoreWebVitalsWithoutImportResolver,
  js.configs.recommended,
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    plugins: { js },
    languageOptions: { globals: globals.browser },
  },
  globalIgnores(['.next', 'dist', 'next-env.d.ts']),
  tseslint.configs.recommended,

  {
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
    },
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooks,
      '@typescript-eslint': tseslint.plugin,
      prettier: prettierPlugin,
    },
    rules: {
      'prettier/prettier': 'warn',
      'react/react-in-jsx-scope': 'off',
      'react-hooks/preserve-manual-memoization': 'off',
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/use-memo': 'off',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      import: importPlugin,
    },
    settings: {
      'import/resolver': {
        [typescriptImportResolver]: {
          project: './tsconfig.json',
        },
      },
    },
    rules: {
      'import/order': [
        'warn',
        {
          groups: [
            'builtin', // fs, path, url, etc.
            'external', // react, lodash, etc.
            'internal', // @data, @widgets, ...
            'parent', // ../
            'sibling', // ./
            'index', // ./ (index)
            'object', // import('pkg').prop
            'type', // import type { X } ...
          ],
          pathGroups: [
            { pattern: '@i18n', group: 'internal', position: 'after' },
            { pattern: '@data/**', group: 'internal', position: 'after' },
            { pattern: '@settings/**', group: 'internal', position: 'after' },
            { pattern: '@widgets/**', group: 'internal', position: 'after' },
            { pattern: '@shared/**', group: 'internal', position: 'after' },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
    },
  },
  prettierConfig,
])
