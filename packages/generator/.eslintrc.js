'use strict'

module.exports = {
  overrides: [{
    files: [
      'generators/**/templates/*',
    ],

    rules: {
      // These are template files. It is expected that the modules referenced from them won't be
      // resolvable here.
      'import/no-unresolved': 'off',
    },
  }],
}
