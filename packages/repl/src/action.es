import os from 'os'
import fs from 'fs'
import fsp from 'promisified-core/fs'
import path from 'path'
import repl from 'repl'
import Action from '@theframework/action'

class Repl extends Action {
  static defaults = {
    historyFile: path.resolve(os.homedir(), '.node_repl_history'),
    username: os.userInfo().username,
    prompt: '✏️ ',
  }

  async enter(options = {}) {
    this.io = {
      in: options.input || process.stdin,
      out: options.output || process.stdout,
    }

    this::say(`${os.EOL}Hello, ${this.config.username}`)
    this::say('Type `app` to play around. Have fun!')

    const history = await this::readHistory()
    const terminal = repl.start({
      input: this.io.in,
      output: this.io.out,
      prompt: this.config.prompt,
      useGlobal: true,
      ignoreUndefined: true,
      breakEvalOnSigint: true,
      replMode: repl.REPL_MODE_STRICT,
    })

    terminal.history = history
    terminal.context.app = this.app
    terminal.once('exit', () => this::say('Bye 👋'))

    await new Promise((resolve, reject) => {
      terminal.once('error', reject)
      terminal.once('exit', resolve)
    })
    await this::saveHistory(terminal.lines)
  }
}


// @TODO (io): When using custom IO (like TCP streams) how should we handle newlines?
// The target OS may not be the same as the one running the app, so `os.EOL` may be incorrect.
function say(message) {
  this.io.out.write(`${message}${os.EOL}`)
}

async function readHistory() {
  const file = this.config.historyFile

  if (!file) {
    return []
  }

  // Load history. This requires a wee bit of work, Node does not provide built-in support for
  // history persistence in custom REPL servers... 😡
  const exists = await new Promise(resolve => fs.exists(file, resolve))
  const inputs = exists
    ? (await fsp.readFile(file, 'utf8'))
      .split(os.EOL)
      .reverse()
      .filter(line => line.trim())
    : []

  return inputs
}

async function saveHistory(inputs) {
  const file = this.config.historyFile

  if (!file) {
    return
  }

  const text = inputs.filter(line => line.trim()).join(os.EOL)
  await fsp.appendFile(file, `${text}${os.EOL}`)
}

export default Repl
