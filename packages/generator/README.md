# @atlas.js/generator-atlas

Yeoman generator to quickly scaffold your Atlas.js app.

## Usage

- Make sure you have `yo` installed: `npm i -g yo`
- Then, install this generator: `npm i -g @atlas.js/generator-atlas`
- Create an empty project folder and cd into it: `mkdir my-app && cd my-app`
- And finally, run the generator: `yo @atlas.js/atlas`

Answer a couple of questions and you are good to go!

## Options & outputs

This generator will create the following for you:

- A Babel compilation toolchain (to work efficiently with Atlas.js it is recommended to use [class fields][class-fields-proposal]). This also includes [ES2015 modules][esmodules-plugin] support.
- A README file explaining everything you need to know to work with the project you generated
- A recommended file & folder structure for working with Atlas.js
- Various configuration files following a pattern most commonly encountered when working on backend services/APIs
- A makefile with all the necessary build targets to work efficiently on the project
- _(optional)_ ESLint configuration, including the [@strv/eslint-config-javascript][strv-ruleset] ruleset
- _(optional)_ Test suite, consisting of Mocha, Chai.js, Sinon.js and NYC, plus some Chai.js plugins
- _(optional)_ VS Code settings & launch configuration files with recommended options

## License

See the [LICENSE](LICENSE) file for information.

[strv-ruleset]: https://github.com/strvcom/eslint-config-javascript
[class-fields-proposal]: https://babeljs.io/docs/en/next/babel-plugin-proposal-class-properties
[esmodules-plugin]: https://babeljs.io/docs/en/next/babel-plugin-transform-modules-commonjs
