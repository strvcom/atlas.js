'use strict'

module.exports = {
  extends: [
    '@commitlint/config-conventional',
  ],

  rules: {
    'scope-enum': [2, 'always', [
      'action',
      'atlas',
      'aws',
      'braintree',
      'cli',
      'component',
      'errors',
      'firebase',
      'generator',
      'hook',
      'koa',
      'mongoose',
      'nodemailer',
      'objection',
      'repl',
      'sequelize',
      'service',
      'templates',
    ]],

    'body-leading-blank': [2, 'always'],
  },
}
