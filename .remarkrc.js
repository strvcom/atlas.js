'use strict'

module.exports = {
  settings: {
    emphasis: '_',
  },
  plugins: [
    'preset-lint-recommended',
    'preset-lint-consistent',
    'preset-lint-markdown-style-guide',

    ['lint-list-item-indent', 'space'],
    ['lint-maximum-line-length', Infinity],
    ['lint-emphasis-marker', '_'],
    ['lint-table-pipe-alignment', false],
    ['lint-table-cell-padding', 'consistent'],
  ],
}
