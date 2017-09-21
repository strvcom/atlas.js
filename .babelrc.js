'use strict'

module.exports = {
  compact: false,
  comments: false,
  sourceMaps: 'inline',
  plugins: [
    'syntax-object-rest-spread',
    ['transform-es2015-modules-commonjs', {
      allowTopLevelThis: false,
    }],
    'transform-class-properties',
    'transform-function-bind',
  ],
  ignore: [
    '**/node_modules',
    'packages/generator/generators/**/templates/*',
  ],
}
