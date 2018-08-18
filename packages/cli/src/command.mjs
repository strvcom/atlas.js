import path from 'path'

/**
 * The Command class represents a single CLI command
 */
class Command {
  /**
   * Arguments this command can take
   * @type    {Array}
   */
  static args = []
  /**
   * option flags this command can take
   * @type    {Array<Array>}
   */
  static options = [
    ['--root <path>', 'Use the Atlas.js app at the given <path>', null, process.cwd()],
  ]

  /**
   * The Atlas.js instance that this command will operate on
   * @type    {Atlas}
   */
  atlas = null


  /**
   * Generate help for this command
   *
   * @param     {caporal~Command}     cmd       The caporal Command instance
   * @return    {void}
   */
  static mkhelp(cmd) {
    cmd.help(this.help || this.description)
  }

  /**
   * Add arguments to the caporal Command based on this class' definition
   *
   * @param     {caporal~Command}     cmd       The caporal Command instance
   * @return    {void}
   */
  static mkargs(cmd) {
    for (const arg of this.args) {
      cmd.argument(...arg)
    }
  }

  /**
   * Add option flags to the caporal Command based on this class' definition
   *
   * @param     {caporal~Command}     cmd       The caporal Command instance
   * @return    {void}
   */
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

  /**
   * Prepare the command for execution
   *
   * @private
   * @param     {Object}    args        Parsed arguments for this command
   * @param     {Object}    options     Parsed options for this command
   * @return    {void}
   */
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
 * @param     {Object}    mod       The module to be normalised
 * @return    {Object}              The normalised module
 */
function normalise(mod) {
  return mod.hasOwnProperty('default') && typeof mod.default === 'object' && mod.default
    ? mod.default
    : mod
}

export default Command
