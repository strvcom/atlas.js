import http from 'http'
import { Server as Koa } from '../..'

describe('Koa::start(instance)', () => {
  const sandbox = sinon.sandbox.create()
  let service
  let instance
  let opts

  before(() => {
    sandbox.stub(Object.getPrototypeOf(http.Server.prototype), 'address').callsFake(() => ({
      port: opts.config.listen.port,
    }))
  })

  after(() => {
    sandbox.restore()
  })

  beforeEach(async () => {
    opts = {
      atlas: {},
      log: {
        info: () => {},
      },
      config: {
        server: { timeout: 20000 },
        listen: {
          port: 1234,
          hostname: '127.0.0.2',
        },
      },
    }
    service = new Koa(opts)
    instance = await service.prepare()
  })

  beforeEach(function() {
    this.sandbox
      .stub(Object.getPrototypeOf(http.Server.prototype), 'listen')
      .callsFake(function stubbedListen() {
        setImmediate(() => void this.emit('listening'))
      })
  })


  it('exists', () => {
    expect(service).to.respondTo('start')
  })

  it('creates and exposes the http server on the koa service via `server`', async () => {
    await service.start(instance)

    expect(instance).to.have.property('server')
    expect(instance.server).to.be.instanceof(http.Server)
  })

  it('applies http config to the server service', async () => {
    await service.start(instance)
    const { server } = instance

    expect(server).to.have.property('timeout', opts.config.server.timeout)
  })

  it('binds to specified hostname and port', async () => {
    await service.start(instance)
    const [port, host] = http.Server.prototype.listen.lastCall.args

    expect(port).to.equal(opts.config.listen.port)
    expect(host).to.equal(opts.config.listen.hostname)
  })

  it('throws if the server emits `error` while binding to a host/port', () => {
    http.Server.prototype.listen.callsFake(function failingListen() {
      setImmediate(() => void this.emit('error', new Error('simulated bind error')))
    })

    return expect(service.start(instance)).to.eventually.be.rejectedWith(
      Error,
      /simulated bind error/,
    )
  })
})
