import { Service as Koa } from '../..'
import http from 'http'

describe('Koa::start()', () => {
  const sandbox = sinon.sandbox.create()
  let service
  let opts

  before(() => {
    sandbox.stub(Object.getPrototypeOf(http.Server.prototype), 'address').callsFake(() => ({
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
    service = new Koa(opts)

    return service.prepare()
  })

  beforeEach(function() {
    this.sb.each
      .stub(Object.getPrototypeOf(http.Server.prototype), 'listen')
      .callsFake(function stubbedListen() {
        setImmediate(() => void this.emit('listening'))
      })
  })


  it('exists', () => {
    expect(service).to.respondTo('start')
  })

  it('creates and exposes the http server on the koa service via `server`', async () => {
    await service.start()

    expect(service.instance).to.have.property('server')
    expect(service.instance.server).to.be.serviceOf(http.Server)
  })

  it('applies http config to the server service', async () => {
    await service.start()
    const { server } = service.instance

    expect(server).to.have.property('timeout', opts.config.http.timeout)
  })

  it('binds to specified hostname and port', async () => {
    await service.start()
    const [port, host] = http.Server.prototype.listen.getCall(0).args

    expect(port).to.equal(opts.config.server.port)
    expect(host).to.equal(opts.config.server.hostname)
  })

  it('throws if the server emits `error` while binding to a host/port', () => {
    http.Server.prototype.listen.callsFake(function failingListen() {
      setImmediate(() => void this.emit('error', new Error('simulated bind error')))
    })

    return expect(service.start()).to.eventually.be.rejectedWith(Error, /simulated bind error/)
  })
})
