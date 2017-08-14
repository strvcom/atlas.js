import { Service as Koa } from '../..'
import { FrameworkError } from '@atlas.js/errors'
import http from 'http'

describe('Koa::stop()', () => {
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

  beforeEach(function() {
    this.sb.each
      .stub(Object.getPrototypeOf(http.Server.prototype), 'close')
      .callsArgWithAsync(0, null)

    service = new Koa({
      app: {},
      log: {
        info: () => {},
      },
    })
    opts = {
      config: {
        http: { timeout: 20000 },
        server: {
          port: 1234,
          hostname: '127.0.0.2',
        },
      },
    }

    return service.prepare(opts)
  })


  it('throws when called on an instance not yet started', () => {
    const msg = /Cannot stop a non-running server/
    return expect(service.stop()).to.eventually.be.rejectedWith(FrameworkError, msg)
  })

  it('throws when called on an instance not yet prepared', () => {
    const msg = /Cannot stop a non-running server/
    service = new Koa()
    return expect(service.stop()).to.eventually.be.rejectedWith(FrameworkError, msg)
  })

  it('closes the http server', async () => {
    service.instance.server = http.createServer()
    await service.stop()

    expect(http.Server.prototype.close).to.have.callCount(1)
  })

  it('throws when the server throws an error while being closed', () => {
    const err = new Error('simulated close error')
    http.Server.prototype.close.callsArgWithAsync(0, err)

    service.instance.server = http.createServer()
    return expect(service.stop()).to.eventually.be.rejectedWith(Error, new RegExp(err.message))
  })
})
