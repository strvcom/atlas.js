'use strict'

module.exports = {
  sourceMaps: 'inline',
  plugins: [
    '@babel/syntax-object-rest-spread',
    ['@babel/transform-modules-commonjs', {
      allowTopLevelThis: false,
      noInterop: true,
    }],
    '@babel/proposal-class-properties',
  ],

  // Do not compile .mjs files found inside node_modules. Not having this config could result in
  // some source files being compiled multiple times if the project contains symlinks pointing to
  // other parts of the same project inside node_modules directories (ie. Lerna monorepo).
  ignore: [
    '**/node_modules',
  ],
}
