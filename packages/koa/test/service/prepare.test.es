import koa from 'koa'
import { Service as Koa } from '../..'

describe('Koa::prepare()', () => {
  let service
  let instance

  beforeEach(async () => {
    service = new Koa({
      app: {},
      log: {},
      config: {},
    })

    instance = await service.prepare()
  })


  it('exists', () => {
    expect(service).to.respondTo('prepare')
  })

  it('returns the koa instance', async () => {
    expect(await service.prepare()).to.be.instanceof(koa)
  })

  it('sets env on the koa instance based on the env of the app', async () => {
    service = new Koa({
      app: { env: 'dummy' },
    })
    instance = await service.prepare()

    expect(instance.env).to.equal('dummy')
  })

  it('sets @atlas.js/application instance on the context as `atlas`', async () => {
    const app = {}
    service = new Koa({
      app,
    })
    instance = await service.prepare()

    expect(instance.context).to.have.property('atlas', app)
  })

  it('sets the service log instance on the context as `log`', async () => {
    const log = {}
    service = new Koa({
      app: {},
      log,
    })
    instance = await service.prepare()

    expect(instance.context).to.have.property('log', log)
  })
})
