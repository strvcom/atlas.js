import * as cluster from 'cluster'
import Start from '../../src/commands/start'

describe('CLI: start', () => {
  let start

  beforeEach(function() {
    start = new Start()
    start.atlas = {
      start: sinon.stub().resolves(),
      stop: sinon.stub().resolves(),
    }

    this.sandbox.stub(process, 'once')
  })

  it('exists', () => {
    expect(Start).to.be.a('function')
  })

  it('defines required static properties', () => {
    expect(Start).to.have.property('command', 'start')
    expect(Start).to.have.property('description')
    expect(Start).to.have.property('options').which.is.an('array')
  })


  describe('.run()', () => {
    it('exists', () => {
      expect(start).to.respondTo('run')
    })

    it('starts the atlas instance', async () => {
      await start.run()

      expect(start.atlas.start).to.have.callCount(1)
    })

    it('stops the atlas instance on signal', async () => {
      await start.run()
      // Grab Heimdall's listener and invoke it to fake a signal
      const onsignal = process.once.lastCall.args[1]
      await onsignal()

      expect(start.atlas.stop).to.have.callCount(1)
    })


    it('disconnects from cluster master upon exit', async () => {
      const disconnect = sinon.stub()
      cluster.isWorker = true
      cluster.worker = { disconnect }

      await start.run()
      // Grab Heimdall's listener and invoke it to fake a signal
      const onsignal = process.once.lastCall.args[1]
      await onsignal()

      cluster.isWorker = false
      delete cluster.worker

      expect(disconnect).to.have.callCount(1)
    })
  })
})
