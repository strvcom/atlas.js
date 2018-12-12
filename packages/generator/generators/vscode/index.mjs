import * as Generator from 'yeoman-generator'

const files = [
  '.vscode/launch.json',
  '.vscode/settings.json',
]

class VSCode extends Generator {
  prompts = [{
    type: 'confirm',
    name: 'vscode',
    message: 'Add VS Code settings and launch configuration?',
    default: true,
  }]

  async prompting() {
    for (const [name, value] of Object.entries(await this.prompt(this.prompts))) {
      this.config.set(name, value)
    }
  }

  writing() {
    if (!this.config.get('vscode')) {
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
module.exports = VSCode
