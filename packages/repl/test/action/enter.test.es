import repl from 'repl'
import { EventEmitter } from 'events'
import { PassThrough } from 'stream'
import crypto from 'crypto'
import path from 'path'
import os from 'os'
import fsp from 'promisified-core/fs'
import Application from '@atlas.js/application'
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
  let app
  let terminal
  let instance
  let opts

  beforeEach(async function() {
    // Prepare default options for the `enter()` method
    opts = {
      output: new PassThrough(),
    }

    // Simulate the return value of repl.start()
    terminal = new EventEmitter()
    terminal.context = {}
    terminal.lines = []
    this.sb.each.spy(terminal, 'once')
    this.sb.each.stub(repl, 'start').returns(terminal)

    // Prepare the app
    app = new Application({
      root: __dirname,
      config: { actions: { repl: {
        // Disable history loading/saving
        historyFile: null,
      } } },
    })
    app.action('repl', Repl)

    await app.prepare()
    instance = app.actions.repl
  })


  it('exists', () => {
    expect(instance).to.respondTo('enter')
  })

  it('does not throw TypeError when no options are given', async () => {
    app = new Application({
      root: __dirname,
      config: { actions: { repl: {
        // Disable history loading/saving
        historyFile: null,
        // Disable greeting in this test case
        greet: false,
      } } },
    })
    app.action('repl', Repl)

    await app.prepare()
    instance = app.actions.repl
    const ret = instance.enter()
    await waitForCall(terminal.once, 2)
    terminal.emit('exit')
    return expect(ret).to.eventually.not.be.rejectedWith(TypeError)
  })

  it('returns promise', async () => {
    const ret = instance.enter(opts)
    expect(ret).to.be.a('promise')

    await waitForCall(terminal.once, 2)
    terminal.emit('exit')

    return ret
  })

  it('exposes `app` as global variable on the repl', async () => {
    // Sanity check
    expect(terminal.context).to.not.have.property('app')

    const ret = instance.enter(opts)
    await waitForCall(terminal.once, 2)
    terminal.emit('exit')

    expect(terminal.context).to.have.property('app', app)

    return ret
  })

  it('sets some defaults on the repl instance', async () => {
    const ret = instance.enter(opts)
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
    expect(args.prompt).to.equal('✏️ ')
    expect(args.useGlobal).to.equal(true)
    expect(args.ignoreUndefined).to.equal(true)
    expect(args.breakEvalOnSigint).to.equal(true)
    expect(args.replMode).to.equal(repl.REPL_MODE_STRICT)

    return ret
  })

  it('allows overriding the prompt via config', async () => {
    app = new Application({
      root: __dirname,
      config: { actions: { repl: {
        historyFile: null,
        prompt: '$ ',
      } } },
    })
    app.action('repl', Repl)
    await app.prepare()
    const ret = app.actions.repl.enter(opts)

    await waitForCall(terminal.once, 2)
    terminal.emit('exit')

    const args = repl.start.getCall(0).args[0]

    expect(args.prompt).to.equal('$ ')

    return ret
  })

  it('allows disabling the welcome message via config', async () => {
    app = new Application({
      root: __dirname,
      config: { actions: { repl: {
        greet: false,
      } } },
    })
    app.action('repl', Repl)
    await app.prepare()
    const ret = app.actions.repl.enter(opts)

    await waitForCall(terminal.once, 2)
    terminal.emit('exit')

    const out = opts.output.read()

    expect(out).to.equal(null)

    return ret
  })

  it('allows overriding the newline sequence via input options', async () => {
    opts.nl = '\r\n'
    const ret = instance.enter(opts)
    await waitForCall(terminal.once, 2)
    terminal.emit('exit')
    await ret

    // Read whatever has been sent to the output
    const out = opts.output.read().toString('utf8')
    const matches = out.match(new RegExp(opts.nl, 'g')) || []
    // Make sure we get four lines separated by the \r\n escape sequence
    expect(matches).to.have.length(4)
  })

  it('allows defining custom newline sequences through configuration alias', async () => {
    app = new Application({
      root: __dirname,
      config: { actions: { repl: {
        newlines: {
          lolnl: '<EOL>',
        },
      } } },
    })
    app.action('repl', Repl)
    await app.prepare()
    opts.nl = 'lolnl'
    const ret = app.actions.repl.enter(opts)
    await waitForCall(terminal.once, 2)
    terminal.emit('exit')
    await ret

    // Read whatever has been sent to the output
    const out = opts.output.read().toString('utf8')
    const matches = out.match(new RegExp('<EOL>', 'g')) || []
    // Make sure we get four lines separated by the <EOL> escape sequence
    expect(matches).to.have.length(4)
  })

  it('supports the `win32` line ending specifier', async () => {
    opts.nl = 'win32'
    const ret = instance.enter(opts)
    await waitForCall(terminal.once, 2)
    terminal.emit('exit')
    await ret

    // Read whatever has been sent to the output
    const out = opts.output.read().toString('utf8')
    const matches = out.match(/\r\n/g) || []
    // Make sure we get four lines separated by the \r\n escape sequence
    expect(matches).to.have.length(4)
  })

  it('supports the `unix` line ending specifier', async () => {
    opts.nl = 'unix'
    const ret = instance.enter(opts)
    await waitForCall(terminal.once, 2)
    terminal.emit('exit')
    await ret

    // Read whatever has been sent to the output
    const out = opts.output.read().toString('utf8')
    const matches = out.match(/\n/g) || []
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

    await fsp.writeFile(historyFile, history.join(os.EOL, 'utf8'))

    app = new Application({
      root: __dirname,
      config: { actions: { repl: {
        historyFile,
      } } },
    })
    app.action('repl', Repl)
    await app.prepare()
    opts.input = new PassThrough()
    const ret = app.actions.repl.enter(opts)
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

    app = new Application({
      root: __dirname,
      config: { actions: { repl: {
        historyFile,
      } } },
    })
    app.action('repl', Repl)
    await app.prepare()
    opts.input = new PassThrough()
    const ret = app.actions.repl.enter(opts)

    await waitForCall(terminal.once, 2)
    terminal.emit('exit')
    await ret
    await fsp.unlink(historyFile)

    expect(terminal.history).to.be.an('array').and.have.length(0)
  })
})
