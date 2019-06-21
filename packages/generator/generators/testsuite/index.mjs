import * as Generator from 'yeoman-generator'

const files = [
  'test/mocha.opts',
  'test/bootstrap.mjs',
  'test/global-hooks.test.mjs',
  'test/atlas/components.test.mjs',
  ['nycrc.json', '.nycrc.json'],
]

const packages = [
  'mocha@latest',
  'chai@latest',
  'chai-as-promised@latest',
  'dirty-chai@latest',
  'sinon@latest',
  'sinon-chai@latest',
  'nyc@latest',
  'source-map-support@latest',
]

class Testsuite extends Generator {
  prompts = [{
    type: 'confirm',
    name: 'testsuite',
    message: 'Install Mocha ☕️ + Chai 🍵 + Sinon 🏛  + NYC 🗽 test suite?',
    default: true,
  }]

  async prompting() {
    for (const [name, value] of Object.entries(await this.prompt(this.prompts))) {
      this.config.set(name, value)
    }
  }

  install() {
    if (!this.config.get('testsuite')) {
      return
    }

    const packagesToInstall = [
      ...packages,
    ]

    // @TODO: We should only do this when the user decided to add ESLint setup ⚠️
    packagesToInstall.push('@strv/eslint-config-mocha@latest')

    this.npmInstall(packagesToInstall, { 'save-dev': true })
  }

  writing() {
    if (!this.config.get('testsuite')) {
      return
    }

    for (const file of files) {
      const [source, destination] = Array.isArray(file)
        ? file
        : [file, file]

      this.fs.copyTpl(
        this.templatePath(source),
        this.destinationPath(destination),
        { config: this.config.getAll() },
      )
    }
  }
}

// Yeoman does not support ES modules' export values 🤦
module.exports = Testsuite
