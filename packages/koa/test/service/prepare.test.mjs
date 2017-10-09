import koa from 'koa'
import { Service as Koa } from '../..'

describe('Koa::prepare()', () => {
  let service
  let instance

  beforeEach(async () => {
    service = new Koa({
      atlas: {},
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

  it('sets env on the koa instance based on the env of the atlas instance', async () => {
    service = new Koa({
      atlas: { env: 'dummy' },
    })
    instance = await service.prepare()

    expect(instance.env).to.equal('dummy')
  })

  it('sets the Atlas instance on the context as `atlas`', async () => {
    const atlas = {}
    service = new Koa({
      atlas,
    })
    instance = await service.prepare()

    expect(instance.context).to.have.property('atlas', atlas)
  })

  it('sets the service log instance on the context as `log`', async () => {
    const log = {}
    service = new Koa({
      atlas: {},
      log,
    })
    instance = await service.prepare()

    expect(instance.context).to.have.property('log', log)
  })
})
