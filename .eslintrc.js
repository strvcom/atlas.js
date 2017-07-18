'use strict'

module.exports = {
  parser: 'babel-eslint',

  plugins: [
    'import',
  ],

  extends: [
    '@strv/javascript/environments/nodejs/v7',
    '@strv/javascript/environments/nodejs/optional',
    '@strv/javascript/coding-styles/recommended',
  ],

  rules: {
    // If your editor cannot show these to you, occasionally turn this off and run the linter
    'no-warning-comments': 0,
  },

  overrides: [{
    files: [
      'test/**',
      'packages/*/test/**/*.test.es',
    ],

    globals: {
      sinon: true,
      expect: true,
    },

    env: {
      mocha: true
    },

    rules: {
      // Do not require function names in test files
      'func-names': 'off',
    }
  }]
}
