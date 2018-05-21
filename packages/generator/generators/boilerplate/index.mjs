import Generator from 'yeoman-generator'

const files = [
  'makefile',
  'babel.config.js',
  'bin/atlas',
  'src/index.mjs',
  'src/actions.mjs',
  'src/aliases.mjs',
  'src/hooks.mjs',
  'src/services.mjs',
  'src/config/index.mjs',
  'src/config/local.mjs',
  'src/config/env/development.mjs',
  'src/config/env/production.mjs',
  'src/components/README.md',
  'src/components/noop/src/index.mjs',
  'src/components/noop/src/service.mjs',
  'src/components/noop/package.json',
]

class Boilerplate extends Generator {
  writing() {
    for (const file of files) {
      this.fs.copy(
        this.templatePath(file),
        this.destinationPath(file),
      )
    }
  }
}

// Yeoman does not support ES modules' export values 🤦
module.exports = Boilerplate
