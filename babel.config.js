'use strict'

module.exports = {
  compact: false,
  comments: false,
  sourceMaps: 'inline',
  plugins: [
    '@babel/syntax-object-rest-spread',
    ['@babel/transform-modules-commonjs', {
      allowTopLevelThis: false,
    }],
    ['@babel/proposal-class-properties', { loose: true }],
    '@babel/proposal-function-bind',
  ],
  ignore: [
    '**/node_modules',
    '**/generators/**/templates/*',
  ],
}
