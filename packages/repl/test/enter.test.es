import repl from 'repl'
import { EventEmitter } from 'events'
import { PassThrough } from 'stream'
import path from 'path'
import os from 'os'
import fsp from 'promisified-core/fs'
import Application from '@strv/application'
import { Action as Repl } from '..'

function waitForCall(spy, callCount = 1) {
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
    app = new Application({ config: { actions: { repl: {
      // Disable history loading/saving
      historyFile: null,
    } } } })
    app.action('repl', Repl)

    await app.prepare()
    instance = app.actions.repl
  })


  it('exists', () => {
    expect(instance).to.respondTo('enter')
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
    app = new Application({ config: { actions: { repl: {
      historyFile: null,
      prompt: '$ ',
    } } } })
    app.action('repl', Repl)
    await app.prepare()
    const ret = app.actions.repl.enter(opts)

    await waitForCall(terminal.once, 2)
    terminal.emit('exit')

    const args = repl.start.getCall(0).args[0]

    expect(args.prompt).to.equal('$ ')

    return ret
  })

  it('reads and saves history to specified file', async () => {
    // Prepare test history
    const historyFile = path.join(os.tmpdir(), '.strv-framework-test-history')
    const history = [
      'null',
      'void 0',
      os.EOL,
    ]

    await fsp.writeFile(historyFile, history.join(os.EOL, 'utf8'))

    app = new Application({ config: { actions: { repl: {
      historyFile,
    } } } })
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
})
