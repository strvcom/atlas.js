import Generator from 'yeoman-generator'

const templates = [
  'src/index.es',
  'src/app.es',
  'src/actions.es',
  'src/hooks.es',
  'src/services.es',
  'src/config/index.es',
  'src/config/local.es',
  'src/config/env/development.es',
  'src/config/env/production.es',
  'src/components/README.md',
  'src/components/noop/src/index.es',
  'src/components/noop/src/service.es',
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
        target: file.replace(/\.es$/, this.options.extension),
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
