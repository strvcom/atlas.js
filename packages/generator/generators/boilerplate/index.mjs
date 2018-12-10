import Generator from 'yeoman-generator'

const files = [
  ['env', '.env'],
  'readme.md',
  'makefile',
  'local.mk',
  'babel.config.js',
  'jsconfig.json',
  'tsconfig.json',
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
  'src/config/atlas.mjs',
  'src/config/actions.mjs',
  'src/config/services.mjs',
  'src/config/hooks.mjs',
  'src/config/aliases.mjs',
  'src/config/local.mjs',
  'src/config/env/test.mjs',
  'src/config/env/development.mjs',
  'src/config/env/production.mjs',
  'src/components/README.md',
  'src/components/noop/src/index.mjs',
  'src/components/noop/src/service.mjs',
  'src/components/noop/package.json',
  'util/make/files',
]

class Boilerplate extends Generator {
  writing() {
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
module.exports = Boilerplate
