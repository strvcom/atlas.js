import * as os from 'os'
import Command from '../command'

/**
 * Attempt to parse JSON and return the original input if that fails
 *
 * @private
 * @param     {String}    input    Input string to be JSON.parse()d
 * @return    {Object|String}       Either the parsed JSON data or the original input
 */
function tryJSON(input) {
  try {
    return JSON.parse(input)
  } catch (err) {
    return input
  }
}

export default class Exec extends Command {
  static command = 'exec'
  static description = 'Execute an action defined on Atlas.js instance'
  static args = [
    ['<action>', 'Action to use'],
    ['<method>', 'Method on the action to be called'],
    ['[args...]', 'Stringified JSON to be given as arguments to the action', null, []],
  ]

  async run(args) {
    const fnArgs = (args.args || []).map(tryJSON)

    await this.atlas.start()
    const result = await this.atlas.actions[args.action][args.method](...fnArgs)
    await this.atlas.stop()

    if (result) {
      process.stdout.write(`${JSON.stringify(result || null)}${os.EOL}`)
    }
  }
}
