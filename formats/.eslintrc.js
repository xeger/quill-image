/**
 * Unified ES+TS+Prettier configuration for ESLint. Inspired by:
 * https://dev.to/robertcoopercode/using-eslint-and-prettier-in-a-typescript-project-53jb
 *
 * This file uses JS (not JSON) so we can have comments and object literals.
 * PLEASE DO NOT ADD CONDITIONALS OR DYNAMIC CODE. Keep this file as pure data.
 */

module.exports = {
  parser: '@typescript-eslint/parser',
  env: {
    es6: true
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    // NB: please leave this at the end so it can override all other rules!
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2018,   // aka ECMAScript 9
    sourceType: 'module', // allow `import` statement
  },
  rules: {
    '@typescript-eslint/array-type': 'warn',
    '@typescript-eslint/camelcase': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-member-accessibility': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'warn',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/no-empty-function': 'warn',
    '@typescript-eslint/no-explicit-any': 'off',
    'no-empty': 'warn',
    'no-extra-boolean-cast': 'warn',
    'prettier/prettier': ['error', {singleQuote: true, trailingComma: 'es5'}],
  },
};
