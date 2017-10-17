import Command from '../command'
import * as repl from '@atlas.js/repl'

export default class Repl extends Command {
  static command = 'repl'
  static description = 'Drop into an interactive shell with Atlas instance exposed via `atlas`'
  static options = [
    ['--action', 'Use atlas.actions[action] as the Repl interface'],
  ]

  async run(args, opts = {}) {
    // If no custom action is specified, register the repl action into the instance and use that
    // to drop into repl
    if (!opts.action) {
      opts.action = 'repl'
      this.atlas.action('repl', repl.Action)
    }

    await this.atlas.start()
    await this.atlas.actions[opts.action].enter()
    await this.atlas.stop()
  }
}
