'use strict'

module.exports = {
  recursive: true,
  colors: true,
  checkLeaks: true,
  require: [
    'source-map-support/register',
    'test/bootstrap',
  ],

  spec: ['test', 'src/**/*.test.js'],
}
