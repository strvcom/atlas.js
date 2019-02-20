'use strict'

module.exports = {
  colors: true,
  checkLeaks: true,
  require: [
    'source-map-support/register',
    'test/bootstrap',
  ],
  spec: ['test', 'packages/*/test/**/*.test.js'],
}
