import os from 'os'
import Command from '../command'

export default class Exec extends Command {
  static command = 'exec'
  static description = 'Execute an action defined on Atlas.js instance'
  static args = [
    ['<action>', 'Action to use'],
    ['<method>', 'Method on the action to be called'],
    ['[args...]', 'Stringified JSON to be given as arguments to the action', null, []],
  ]

  async run(args) {
    const fnArgs = (args.args || []).map(JSON.parse)

    await this.atlas.start()
    const result = await this.atlas.actions[args.action][args.method](...fnArgs)
    await this.atlas.stop()

    if (result) {
      process.stdout.write(`${JSON.stringify(result || null)}${os.EOL}`)
    }
  }
}
