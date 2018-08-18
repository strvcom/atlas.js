import http from 'http'
import { FrameworkError } from '@atlas.js/errors'
import { Server as Koa } from '../..'

describe('Koa::stop(instance)', () => {
  const sandbox = sinon.createSandbox()
  let service
  let instance
  let opts

  before(() => {
    sandbox.stub(Object.getPrototypeOf(http.Server.prototype), 'address').callsFake(() => ({
      port: opts.config.server.port,
    }))
  })

  after(() => {
    sandbox.restore()
  })

  beforeEach(async function() {
    this.sandbox
      .stub(Object.getPrototypeOf(http.Server.prototype), 'close')
      .callsArgWithAsync(0, null)

    service = new Koa({
      atlas: {},
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

    instance = await service.prepare(opts)
    instance.server = http.createServer()
  })


  it('throws when called on an instance not yet started', () => {
    delete instance.server
    const msg = /Cannot stop a non-running server/u
    return expect(service.stop(instance)).to.eventually.be.rejectedWith(FrameworkError, msg)
  })

  it('throws when called on an instance not yet prepared', () => {
    delete instance.server
    const msg = /Cannot stop a non-running server/u
    service = new Koa({})
    return expect(service.stop(instance)).to.eventually.be.rejectedWith(FrameworkError, msg)
  })

  it('closes the http server', async () => {
    await service.stop(instance)

    expect(http.Server.prototype.close).to.have.callCount(1)
  })

  it('throws when the server throws an error while being closed', () => {
    const err = new Error('simulated close error')
    http.Server.prototype.close.callsArgWithAsync(0, err)

    return expect(service.stop(instance)).to.eventually.be.rejectedWith(
      Error,
      new RegExp(err.message, 'u'),
    )
  })
})
