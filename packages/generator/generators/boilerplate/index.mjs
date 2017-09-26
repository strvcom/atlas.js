import Generator from 'yeoman-generator'

const templates = [
  'src/index.mjs',
  'src/app.mjs',
  'src/actions.mjs',
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
  async prompting() {
    this.options = {
      ...this.options,
      ...await this.prompt({
        type: 'input',
        name: 'extension',
        default: '.mjs',
        message: 'File extension to use for project files:',
      }),
    }
  }

  writing() {
    const files = templates
      .map(file => ({
        source: file,
        target: file.replace(/\.mjs$/, this.options.extension),
      }))

    for (const template of files) {
      this.fs.copy(
        this.templatePath(template.source),
        this.destinationPath(template.target),
      )
    }
  }
}

// Yeoman does not support ES modules' export values 🤦
module.exports = Boilerplate
