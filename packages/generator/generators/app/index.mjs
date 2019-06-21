import * as Generator from 'yeoman-generator'

const generators = {
  npm: require.resolve('generator-npm-init'),
  git: require.resolve('generator-git-init'),
  gitignore: require.resolve('../gitignore'),
  editorconfig: require.resolve('../editorconfig'),
  boilerplate: require.resolve('../boilerplate'),
  eslint: require.resolve('../eslint'),
  testsuite: require.resolve('../testsuite'),
  vscode: require.resolve('../vscode'),
}

class Atlas extends Generator {
  initializing() {
    const configs = {
      npm: {
        description: 'An Atlas.js application 😎',
        main: 'src',
        'skip-test': true,
        keywords: [
          'atlas.js',
          'atlas.js-app',
        ],
      },
      git: null,
      gitignore: null,
      editorconfig: {
        root: true,
      },
      boilerplate: null,
      eslint: null,
      testsuite: null,
      vscode: null,
    }

    this.composeWith(generators.npm, configs.npm)
    this.composeWith(generators.git, configs.git)
    this.composeWith(generators.gitignore, configs.gitignore)
    this.composeWith(generators.editorconfig, configs.editorconfig)
    this.composeWith(generators.boilerplate, configs.boilerplate)
    this.composeWith(generators.eslint, configs.eslint)
    this.composeWith(generators.testsuite, configs.testsuite)
    this.composeWith(generators.vscode, configs.vscode)
  }

  install() {
    this.npmInstall([
      '@atlas.js/atlas@latest',
      '@atlas.js/cli@latest',
      './src/components/noop',
    ], { save: true })
    this.npmInstall([
      '@babel/cli@latest',
      '@babel/core@latest',
      '@babel/plugin-proposal-class-properties@latest',
      '@babel/plugin-syntax-object-rest-spread@latest',
      '@babel/plugin-transform-modules-commonjs@latest',
      'dotenv@latest',
      'pino-pretty@latest',
    ], { 'save-dev': true })
  }
}

// Yeoman does not support ES modules' export values 🤦
module.exports = Atlas
