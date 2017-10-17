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

    it('registers SIGINT and SIGTERM event listeners', async () => {
      const counts = {
        SIGINT: process.listenerCount('SIGINT'),
        SIGTERM: process.listenerCount('SIGTERM'),
      }

      await start.run()

      expect(process.listenerCount('SIGINT')).to.equal(counts.SIGINT + 1)
      expect(process.listenerCount('SIGTERM')).to.equal(counts.SIGTERM + 1)
    })

    it('removes SIGINT and SIGTERM event listeners upon receiving them', async () => {
      const counts = {
        SIGINT: process.listenerCount('SIGINT'),
        SIGTERM: process.listenerCount('SIGTERM'),
      }

      await start.run()
      await start.doExit()

      expect(process.listenerCount('SIGINT')).to.equal(counts.SIGINT)
      expect(process.listenerCount('SIGTERM')).to.equal(counts.SIGTERM)
    })

    it('stops the atlas instance upon exit', async () => {
      // Sanity check
      expect(start.atlas.stop).to.have.callCount(0)

      await start.run()
      await start.doExit()

      expect(start.atlas.stop).to.have.callCount(1)
    })
  })
})
