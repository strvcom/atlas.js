import Generator from 'yeoman-generator'

class Gitignore extends Generator {
  writing() {
    this.fs.copyTpl(
      this.templatePath('gitignore'),
      this.destinationPath('.gitignore')
    )
  }
}

// Yeoman does not support ES modules' export values 🤦
module.exports = Gitignore
