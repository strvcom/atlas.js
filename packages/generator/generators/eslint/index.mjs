import Generator from 'yeoman-generator'

const files = [
  ['eslintrc.js', '.eslintrc.js'],
  ['eslintignore', '.eslintignore'],
]

class ESLint extends Generator {
  prompts = [{
    type: 'confirm',
    name: 'eslint',
    message: 'Install ESLint with @strv/eslint-config-javascript ruleset? 🎨',
    default: true,
  }]

  async prompting() {
    for (const [name, value] of Object.entries(await this.prompt(this.prompts))) {
      this.config.set(name, value)
    }
  }

  install() {
    if (!this.config.get('eslint')) {
      return
    }

    this.npmInstall([
      'eslint@latest',
      'babel-eslint@latest',
      '@strv/eslint-config-javascript@latest',
    ], { 'save-dev': true })
  }

  writing() {
    if (!this.config.get('eslint')) {
      return
    }

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
module.exports = ESLint
