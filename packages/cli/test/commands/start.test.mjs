import cluster from 'cluster'
import Start from '../../src/commands/start'

describe('CLI: start', () => {
  let start

  beforeEach(() => {
    start = new Start()
    start.atlas = {
      start: sinon.stub().resolves(),
      stop: sinon.stub().resolves(),
    }
  })

  afterEach(() => start.doExit())


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

    it('registers SIGINT, SIGTERM and beforeExit event listeners', async () => {
      const counts = {
        SIGINT: process.listenerCount('SIGINT'),
        SIGTERM: process.listenerCount('SIGTERM'),
        beforeExit: process.listenerCount('beforeExit'),
      }

      await start.run()

      expect(process.listenerCount('SIGINT')).to.equal(counts.SIGINT + 1)
      expect(process.listenerCount('SIGTERM')).to.equal(counts.SIGTERM + 1)
      expect(process.listenerCount('beforeExit')).to.equal(counts.beforeExit + 1)
    })

    it('removes SIGINT, SIGTERM and beforeExit listeners upon receiving a signal', async () => {
      const counts = {
        SIGINT: process.listenerCount('SIGINT'),
        SIGTERM: process.listenerCount('SIGTERM'),
        beforeExit: process.listenerCount('beforeExit'),
      }

      await start.run()
      await start.doExit()

      expect(process.listenerCount('SIGINT')).to.equal(counts.SIGINT)
      expect(process.listenerCount('SIGTERM')).to.equal(counts.SIGTERM)
      expect(process.listenerCount('beforeExit')).to.equal(counts.beforeExit)
    })

    it('stops the atlas instance upon exit', async () => {
      // Sanity check
      expect(start.atlas.stop).to.have.callCount(0)

      await start.run()
      await start.doExit()

      expect(start.atlas.stop).to.have.callCount(1)
    })

    it('disconnects from cluster master upon exit', async () => {
      const disconnect = sinon.stub()
      cluster.isWorker = true
      cluster.worker = { disconnect }

      await start.run()
      await start.doExit()

      cluster.isWorker = false
      delete cluster.worker

      expect(disconnect).to.have.callCount(1)
    })

    it('throws an error to stop the process if a terminating signal is sent again', async () => {
      await start.run()
      start.doExit()

      // Sending SIGINT causes the test suite to exit with code 130, so just test SIGTERM 🤷‍♂️
      expect(() => process.emit('SIGTERM')).to.throw(Error, /Forced quit/)

      delete process.exitCode
    })

    it('kills the process after 10s if an error occurs during stop procedure', async function() {
      this.sandbox.stub(process, 'exit')
      this.sandbox.stub(console, 'error')

      const error = new Error('u-oh')
      const clock = sinon.useFakeTimers({
        toFake: ['setTimeout'],
      })

      start.atlas.stop.rejects(error)
      await start.doExit()

      // eslint-disable-next-line no-console
      expect(console.error).to.have.been.calledWith(error.stack)
      expect(process.exit).to.have.callCount(0)

      clock.runAll()
      clock.restore()

      expect(process.exit).to.have.callCount(1)
      expect(process.exitCode).to.equal(1)
      expect(clock.now).to.equal(10000)

      delete process.exitCode
    })
  })
})
