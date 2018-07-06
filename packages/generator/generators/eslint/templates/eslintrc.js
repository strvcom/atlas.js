'use strict'

module.exports = {
  parser: 'babel-eslint',

  extends: [
    '@strv/javascript/environments/nodejs/v10',
    '@strv/javascript/environments/nodejs/optional',
    '@strv/javascript/coding-styles/recommended',
  ],

  rules: {
    // If your editor cannot show these to you, occasionally turn this off and run the linter
    'no-warning-comments': 0,
  },

  overrides: [{
    // Custom settings for your test files
    files: [
      '**/*.test.mjs',
    ],

    env: {
      // Enable your test environment of choice here to have ESLint recognise its globals
      // mocha: true,
    },
  }, {
    // Custom settings for plain JavaScript files
    files: [
      '*.js',
      '.*.js',
    ],

    parserOptions: {
      sourceType: 'script',
    },
  }],
}
