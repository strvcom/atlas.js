import repl from 'repl'
import { EventEmitter } from 'events'
import { PassThrough } from 'stream'
import crypto from 'crypto'
import path from 'path'
import os from 'os'
import fsp from 'promisified-core/fs'
import { Action as Repl } from '../..'

function waitForCall(spy, callCount) {
  return new Promise(resolve => {
    const intv = setInterval(() => {
      if (spy.callCount >= callCount) {
        clearInterval(intv)
        return void resolve()
      }
    }, 0)
  })
}


describe('Repl::enter()', () => {
  let terminal
  let action
  let config
  let opts

  beforeEach(function() {
    // Prepare default options for the `enter()` method
    opts = {
      output: new PassThrough(),
    }
    // Prepare default config for the action
    config = {
      historyFile: null,
      username: 'trolley',
      prompt: '✏️ ',
      greet: true,
      newlines: {
        unix: '\n',
        win32: '\r\n',
      },
    }

    // Simulate the return value of repl.start()
    terminal = new EventEmitter()
    terminal.context = {}
    terminal.lines = []
    this.sandbox.spy(terminal, 'once')
    this.sandbox.stub(repl, 'start').returns(terminal)

    action = new Repl({
      atlas: {},
      log: {},
      config,
    })
  })


  it('exists', () => {
    expect(action).to.respondTo('enter')
  })

  it('does not throw TypeError when no options are given', async () => {
    // Disable greeting in this test case
    config.greet = false
    const ret = action.enter()
    await waitForCall(terminal.once, 2)
    terminal.emit('exit')
    return expect(ret).to.eventually.not.be.rejectedWith(TypeError)
  })

  it('returns promise', async () => {
    const ret = action.enter(opts)
    expect(ret).to.be.a('promise')

    await waitForCall(terminal.once, 2)
    terminal.emit('exit')

    return ret
  })

  it('exposes `atlas` as global variable on the repl', async () => {
    // Sanity check
    expect(terminal.context).to.not.have.property('atlas')

    const ret = action.enter(opts)
    await waitForCall(terminal.once, 2)
    terminal.emit('exit')

    expect(terminal.context).to.have.property('atlas')
    expect(terminal.context.atlas).to.be.an('object')

    return ret
  })

  it('sets some defaults on the repl instance', async () => {
    const ret = action.enter(opts)
    await waitForCall(terminal.once, 2)
    terminal.emit('exit')

    const args = repl.start.getCall(0).args[0]

    expect(args).to.have.all.keys([
      'input',
      'output',
      'prompt',
      'useGlobal',
      'ignoreUndefined',
      'breakEvalOnSigint',
      'replMode',
    ])

    expect(args.input).to.equal(process.stdin)
    // Ignoring default for `args.output` because I don't want to have anything printed to stdout 😇
    expect(args.prompt).to.equal(config.prompt)
    expect(args.useGlobal).to.equal(true)
    expect(args.ignoreUndefined).to.equal(true)
    expect(args.breakEvalOnSigint).to.equal(true)
    expect(args.replMode).to.equal(repl.REPL_MODE_STRICT)

    return ret
  })

  it('allows overriding the prompt via config', async () => {
    config.prompt = '$ '
    const ret = action.enter(opts)

    await waitForCall(terminal.once, 2)
    terminal.emit('exit')

    expect(repl.start.getCall(0).args[0].prompt).to.equal('$ ')

    return ret
  })

  it('allows disabling the welcome message via config', async () => {
    config.greet = false

    const ret = action.enter(opts)

    await waitForCall(terminal.once, 2)
    terminal.emit('exit')

    expect(opts.output.read()).to.equal(null)

    return ret
  })

  it('allows overriding the newline sequence via input options', async () => {
    opts.nl = '\r\n'
    const ret = action.enter(opts)
    await waitForCall(terminal.once, 2)
    terminal.emit('exit')
    await ret

    // Read whatever has been sent to the output
    const out = opts.output.read().toString('utf8')
    const matches = out.match(new RegExp(opts.nl, 'ug'))
    // Make sure we get four lines separated by the \r\n escape sequence
    expect(matches).to.have.length(4)
  })

  it('allows defining custom newline sequences through configuration alias', async () => {
    config.newlines.lolnl = '<EOL>'
    opts.nl = 'lolnl'

    const ret = action.enter(opts)

    await waitForCall(terminal.once, 2)
    terminal.emit('exit')
    await ret

    // Read whatever has been sent to the output
    const out = opts.output.read().toString('utf8')
    const matches = out.match(new RegExp('<EOL>', 'ug'))
    // Make sure we get four lines separated by the <EOL> escape sequence
    expect(matches).to.have.length(4)
  })

  it('supports the `win32` line ending specifier', async () => {
    opts.nl = 'win32'
    const ret = action.enter(opts)
    await waitForCall(terminal.once, 2)
    terminal.emit('exit')
    await ret

    // Read whatever has been sent to the output
    const out = opts.output.read().toString('utf8')
    const matches = out.match(/\r\n/ug)
    // Make sure we get four lines separated by the \r\n escape sequence
    expect(matches).to.have.length(4)
  })

  it('supports the `unix` line ending specifier', async () => {
    opts.nl = 'unix'
    const ret = action.enter(opts)
    await waitForCall(terminal.once, 2)
    terminal.emit('exit')
    await ret

    // Read whatever has been sent to the output
    const out = opts.output.read().toString('utf8')
    const matches = out.match(/\n/ug)
    // Make sure we get four lines separated by the \r\n escape sequence
    expect(matches).to.have.length(4)
  })

  it('reads and saves history to specified file', async () => {
    // Prepare test history
    const historyFile = path.resolve(os.tmpdir(), '.strv-atlas-test-history')
    const history = [
      'null',
      'void 0',
      os.EOL,
    ]
    config.historyFile = historyFile
    await fsp.writeFile(historyFile, history.join(os.EOL, 'utf8'))

    opts.input = new PassThrough()
    const ret = action.enter(opts)
    await waitForCall(terminal.once, 2)

    terminal.lines.push('123')
    terminal.emit('exit')

    await ret

    // Check the the history file was loaded
    expect(terminal.history).to.have.members(['null', 'void 0'])

    // Check that the history file contains our command!
    const contents = await fsp.readFile(historyFile, 'utf8')
    await fsp.unlink(historyFile)
    const last = contents.trim().split(os.EOL).pop()

    expect(last).to.equal('123')
  })

  it('does not throw then the history file does not exist', async () => {
    const tmpname = `.atlas-${crypto.randomBytes(6).toString('hex')}`
    const historyFile = path.resolve(os.tmpdir(), tmpname)

    config.historyFile = historyFile
    opts.input = new PassThrough()

    const ret = action.enter(opts)

    await waitForCall(terminal.once, 2)
    terminal.emit('exit')
    await ret
    await fsp.unlink(historyFile)

    expect(terminal.history).to.be.an('array').and.have.length(0)
  })
})
