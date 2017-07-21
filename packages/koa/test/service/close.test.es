import { Service as Koa } from '../..'
import { FrameworkError } from '@theframework/errors'
import http from 'http'

describe('Koa::stop()', () => {
  const sandbox = sinon.sandbox.create()
  let instance
  let opts

  before(() => {
    sandbox.stub(http.Server.prototype, 'address').callsFake(() => ({
      port: opts.config.server.port,
    }))
    // sandbox.stub(Koa.prototype, 'start').callsFake(function stubbedStart() {
    //   this.instance.server = http.createServer()
    // })
  })

  after(() => {
    sandbox.restore()
  })

  beforeEach(() => {
    instance = new Koa({
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

    return instance.prepare(opts)
  })


  it('throws when called on an instance not yet started', () => {
    const msg = /Cannot stop a non-running server/
    return expect(instance.stop()).to.eventually.be.rejectedWith(FrameworkError, msg)
  })

  it('throws when called on an instance not yet prepared', () => {
    const msg = /Cannot stop a non-running server/
    instance = new Koa()
    return expect(instance.stop()).to.eventually.be.rejectedWith(FrameworkError, msg)
  })

  it('closes the http server', async function() {
    this.sb.each.stub(http.Server.prototype, 'close').callsArgWithAsync(0, null)

    instance.instance.server = http.createServer()
    await instance.stop()

    expect(http.Server.prototype.close).to.have.callCount(1)
  })

  it('throws when the server throws an error while being closed', function() {
    const err = new Error('simulated close error')
    this.sb.each.stub(http.Server.prototype, 'close').callsArgWithAsync(0, err)

    instance.instance.server = http.createServer()
    return expect(instance.stop()).to.eventually.be.rejectedWith(Error, new RegExp(err.message))
  })
})
