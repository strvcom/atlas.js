'use strict'

module.exports = {
  parser: 'babel-eslint',

  extends: [
    '@strv/javascript/environments/nodejs/v8-3',
    '@strv/javascript/environments/nodejs/optional',
    '@strv/javascript/coding-styles/recommended',
  ],

  rules: {
    // If your editor cannot show these to you, occasionally turn this off and run the linter
    'no-warning-comments': 0,
  },

  overrides: [{
    files: [
      '**/*.test.mjs',
    ],

    env: {
      mocha: true,
    },

    globals: {
      sinon: true,
      expect: true,
    },
  }, {
    files: [
      '*.js',
      '.*.js',
    ],

    parserOptions: {
      sourceType: 'script',
    },
  }],
}
