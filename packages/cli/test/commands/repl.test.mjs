import Repl from '../../src/commands/repl'

describe('CLI: repl', () => {
  let repl

  beforeEach(() => {
    repl = new Repl()
    repl.atlas = {
      start: sinon.stub(),
      stop: sinon.stub(),
      action: sinon.stub(),
      actions: {
        repl: {
          enter: sinon.stub(),
        },
        myrepl: {
          enter: sinon.stub(),
        },
      },
    }
  })


  it('exists', () => {
    expect(Repl).to.be.a('function')
  })

  it('defines required static properties', () => {
    expect(Repl).to.have.property('command', 'repl')
    expect(Repl).to.have.property('description')
    expect(Repl).to.have.property('options').which.is.an('array')
  })


  describe('.run()', () => {
    it('exists', () => {
      expect(repl).to.respondTo('run')
    })

    it('drops into a repl using the repl action', async () => {
      await repl.run()

      expect(repl.atlas.actions.repl.enter).to.have.callCount(1)
    })

    it('adds the @atlas.js/repl action to Atlas if no custom action is specified', async () => {
      await repl.run()

      expect(repl.atlas.action).to.have.callCount(1)
      expect(repl.atlas.action.firstCall.args[0]).to.equal('repl')
    })

    it('allows using custom repl action name', async () => {
      await repl.run(null, {
        action: 'myrepl',
      })

      expect(repl.atlas.actions.myrepl.enter).to.have.callCount(1)
    })
  })
})
