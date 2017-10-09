import os from 'os'
import fs from 'fs'
import fsp from 'promisified-core/fs'
import path from 'path'
import repl from 'repl'
import Action from '@atlas.js/action'

class Repl extends Action {
  static defaults = {
    historyFile: path.resolve(os.homedir(), '.node_repl_history'),
    username: os.userInfo().username,
    prompt: '✏️ ',
    greet: true,
    newlines: {
      unix: '\n',
      win32: '\r\n',
    },
  }

  async enter(options = {}) {
    this.io = {
      in: options.input || process.stdin,
      out: options.output || process.stdout,
      nl: options.nl || os.EOL,
    }

    if (this.io.nl in this.config.newlines) {
      this.io.nl = this.config.newlines[this.io.nl]
    }

    if (this.config.greet) {
      this::say(`${this.io.nl}Hello, ${this.config.username}`)
      this::say('Type `atlas` to play around. Have fun!')
    }

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
    terminal.context.atlas = this.atlas
    terminal.once('exit', () => {
      if (this.config.greet) {
        this::say('Bye 👋')
      }
    })

    await new Promise((resolve, reject) => {
      terminal.once('error', reject)
      terminal.once('exit', resolve)
    })
    await this::saveHistory(terminal.lines)
  }
}

function say(message) {
  this.io.out.write(`${message}${this.io.nl}`)
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
