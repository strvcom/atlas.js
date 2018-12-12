import * as fs from 'fs'
import * as path from 'path'
import * as pkg from '../package'
import commands from './commands'

const help = fs.readFileSync(path.join(__dirname, 'more-info.txt'), 'utf8')

/**
 * @typedef  {import("caporal")} Caporal
 */

/**
 * The CLI entry point
 *
 * You should not call this function directly.
 *
 * @private
 * @param     {Caporal}   caporal     The caporal module
 * @param     {Array}     argv        CLI arguments
 * @return    {void}
 */
export default function cli(caporal, argv) {
  caporal.version(pkg.version)
  caporal.description('Atlas.js CLI utility')
  caporal.help(help)

  for (const Command of commands) {
    const command = new Command()
    const cmd = caporal.command(Command.command, Command.description)

    if (typeof command.complete === 'function') {
      cmd.complete((...args) => command.complete(...args))
    }

    cmd.action(async (...args) => {
      try {
        await command.prerun(...args)
        await command.run(...args)
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err.stack)
        process.exitCode = 1

        await command.atlas.stop()
      }
    })

    Command.mkhelp(cmd)
    Command.mkargs(cmd)
    Command.mkoptions(cmd)
  }

  return caporal.parse(argv)
}
