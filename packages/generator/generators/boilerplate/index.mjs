import Generator from 'yeoman-generator'

const files = [
  ['env', '.env'],
  'makefile',
  'babel.config.js',
  'bin/atlas',
  'src/index.mjs',
  'src/aliases.mjs',
  'src/actions/index.mjs',
  'src/actions/README.md',
  'src/hooks/index.mjs',
  'src/hooks/README.md',
  'src/services/index.mjs',
  'src/services/README.md',
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
      const [source, destination] = Array.isArray(file)
        ? file
        : [file, file]

      this.fs.copy(
        this.templatePath(source),
        this.destinationPath(destination),
      )
    }
  }
}

// Yeoman does not support ES modules' export values 🤦
module.exports = Boilerplate
