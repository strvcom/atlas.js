import path from 'path'

export default class Command {
  static args = []
  static options = [
    ['--root <path>', 'Use the Atlas.js app at the given <path>', null, process.cwd()],
  ]

  atlas = null

  static mkhelp(cmd) {
    cmd.help(this.help || this.description)
  }

  static mkargs(cmd) {
    for (const arg of this.args) {
      cmd.argument(...arg)
    }
  }

  static mkoptions(cmd) {
    // Merge options from the subclass and from this class
    const options = [
      ...this.options,
      ...Command.options,
    ]

    for (const option of options) {
      cmd.option(...option)
    }
  }

  prerun(args, options) {
    // Utilise --root global flag
    const location = path.resolve(process.cwd(), options.root)
    // eslint-disable-next-line global-require
    this.atlas = normalise(require(location))
  }
}


/**
 * Normalise a module into either a default export or all the rest
 *
 * @private
 * @param     {Object}    module    The module to be normalised
 * @return    {Object}              The normalised module
 */
function normalise(module) {
  return module.hasOwnProperty('default') && typeof module.default === 'object' && module.default
    ? module.default
    : module
}
