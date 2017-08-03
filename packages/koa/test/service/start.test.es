import { Service as Koa } from '../..'
import http from 'http'

describe('Koa::start()', () => {
  const sandbox = sinon.sandbox.create()
  let instance
  let opts

  before(() => {
    sandbox.stub(http.Server.prototype, 'address').callsFake(() => ({
      port: opts.config.server.port,
    }))
  })

  after(() => {
    sandbox.restore()
  })

  beforeEach(() => {
    opts = {
      app: {},
      log: {
        info: () => {},
      },
      config: {
        http: { timeout: 20000 },
        server: {
          port: 1234,
          hostname: '127.0.0.2',
        },
      },
    }
    instance = new Koa(opts)

    return instance.prepare()
  })

  beforeEach(function() {
    this.sb.each.stub(http.Server.prototype, 'listen').callsFake(function stubbedListen() {
      setImmediate(() => void this.emit('listening'))
    })
  })


  it('exists', () => {
    expect(instance).to.respondTo('start')
  })

  it('creates and exposes the http server on the koa instance via `server`', async () => {
    await instance.start()

    expect(instance.instance).to.have.property('server')
    expect(instance.instance.server).to.be.instanceOf(http.Server)
  })

  it('applies http config to the server instance', async () => {
    await instance.start()
    const { server } = instance.instance

    expect(server).to.have.property('timeout', opts.config.http.timeout)
  })

  it('binds to specified hostname and port', async () => {
    await instance.start()
    const [port, host] = http.Server.prototype.listen.getCall(0).args

    expect(port).to.equal(opts.config.server.port)
    expect(host).to.equal(opts.config.server.hostname)
  })

  it('throws if the server emits `error` while binding to a host/port', () => {
    http.Server.prototype.listen.callsFake(function failingListen() {
      setImmediate(() => void this.emit('error', new Error('simulated bind error')))
    })

    return expect(instance.start()).to.eventually.be.rejectedWith(Error, /simulated bind error/)
  })
})
