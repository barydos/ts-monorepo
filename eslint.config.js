/* eslint @typescript-eslint/no-var-requires: 0 */

const globals = require('globals');
const eslint = require('@eslint/js');
const stylisticJs = require('@stylistic/eslint-plugin-js');
const simpleImportSort = require('eslint-plugin-simple-import-sort');
const tseslint = require('typescript-eslint');
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');

module.exports = tseslint.config(
  eslintPluginPrettierRecommended,
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,
  {
    ignores: ['**/dist'],
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  },
  {
    plugins: {
      '@stylistic/js': stylisticJs,
    },
    rules: {
      '@stylistic/js/quotes': ['error', 'single'],
    },
  },
);
