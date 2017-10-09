import Generator from 'yeoman-generator'

const generators = {
  npm: require.resolve('generator-npm-init'),
  git: require.resolve('generator-git-init'),
  gitignore: require.resolve('../gitignore'),
  editorconfig: require.resolve('../editorconfig'),
  boilerplate: require.resolve('../boilerplate'),
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
    }

    this.composeWith(generators.npm, configs.npm)
    this.composeWith(generators.git, configs.git)
    this.composeWith(generators.gitignore, configs.gitignore)
    this.composeWith(generators.editorconfig, configs.editorconfig)
    this.composeWith(generators.boilerplate, configs.boilerplate)
  }

  install() {
    this.npmInstall('@atlas.js/atlas', { save: true })
  }
}

// Yeoman does not support ES modules' export values 🤦
module.exports = Atlas
