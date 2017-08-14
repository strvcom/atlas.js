import koa from 'koa'
import { Service as Koa } from '../..'

describe('Koa::prepare()', () => {
  let service

  beforeEach(() => {
    service = new Koa({
      app: {},
      log: {},
      config: {},
    })

    return service.prepare()
  })


  it('exists', () => {
    expect(service).to.respondTo('prepare')
  })

  it('exposes the original koa instance on this.service', () => {
    expect(service.instance).to.be.instanceof(koa)
  })

  it('returns the koa service as well', async () => {
    expect(await service.prepare()).to.be.instanceof(koa)
  })

  it('sets env on the koa instance based on the env of the app', async () => {
    service = new Koa({
      app: { env: 'dummy' },
    })
    await service.prepare()

    expect(service.instance.env).to.equal('dummy')
  })

  it('sets @atlas.js/application instance on the context as `atlas`', async () => {
    const app = {}
    service = new Koa({
      app,
    })
    await service.prepare()

    expect(service.instance.context).to.have.property('atlas', app)
  })

  it('sets the service log instance on the context as `log`', async () => {
    const log = {}
    service = new Koa({
      app: {},
      log,
    })
    await service.prepare()

    expect(service.instance.context).to.have.property('log', log)
  })
})
