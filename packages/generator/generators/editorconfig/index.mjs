import Generator from 'yeoman-generator'

class EditorConfig extends Generator {
  constructor(...args) {
    super(...args)

    this.option('root', {
      type: Boolean,
      required: false,
      default: false,
      desc: 'Generate an EditorConfig with `root = true`',
    })
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath('editorconfig.ini'),
      this.destinationPath('.editorconfig'),
      { root: this.options.root },
    )
  }
}

// Yeoman does not support ES modules' export values 🤦
module.exports = EditorConfig
