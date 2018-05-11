import fs from 'fs'
import path from 'path'
import pkg from '../package'
import commands from './commands'

const help = fs.readFileSync(path.join(__dirname, 'more-info.txt'), 'utf8')

/**
 * The CLI entry point
 *
 * You should not call this function directly.
 *
 * @private
 * @param     {Object}    caporal     The caporal module
 * @param     {Array}     argv        CLI arguments
 * @return    {caporal~Program}
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
      await command.prerun(...args)
      await command.run(...args)
    })

    Command.mkhelp(cmd)
    Command.mkargs(cmd)
    Command.mkoptions(cmd)
  }

  return caporal.parse(argv)
}
