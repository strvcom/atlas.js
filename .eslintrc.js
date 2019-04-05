'use strict'

module.exports = {
  parser: 'babel-eslint',

  extends: [
    '@strv/node/v8',
    '@strv/node/optional',
    '@strv/node/style',
    '@strv/mocha',
  ],

  rules: {
    // If your editor cannot show these to you, occasionally turn this off and run the linter
    'no-warning-comments': 0,

    'node/no-unsupported-features/es-syntax': ['error', {
      ignores: ['modules'],
    }],

    'node/shebang': ['warn', {
      convertPath: {
        '**/*.mjs': ['^(\.+).mjs', '$1.js'],
      },
    }],
  },

  overrides: [{
    files: [
      '**/*.test.mjs',
    ],

    globals: {
      sinon: true,
      expect: true,
    },

    rules: {
      'max-classes-per-file': 'off',
    },
  }],
}
