import koa from 'koa'
import { Service as Koa } from '../..'

describe('Koa::prepare()', () => {
  let instance
  let opts

  beforeEach(() => {
    instance = new Koa({
      app: {},
      log: {},
    })
    opts = {
      config: {},
    }

    return instance.prepare(opts)
  })


  it('exists', () => {
    expect(instance).to.respondTo('prepare')
  })

  it('exposes the original koa instance on this.instance', () => {
    expect(instance.instance).to.be.instanceOf(koa)
  })

  it('returns the koa instance as well', async () => {
    expect(await instance.prepare(opts)).to.be.instanceOf(koa)
  })

  it('sets env on the koa instance based on the env of the app', async () => {
    instance = new Koa({
      app: { env: 'dummy' },
    })
    await instance.prepare(opts)

    expect(instance.instance.env).to.equal('dummy')
  })

  it('sets @theframework/application instance on the context as `framework`', async () => {
    const app = {}
    instance = new Koa({
      app,
    })
    await instance.prepare(opts)

    expect(instance.instance.context).to.have.property('framework', app)
  })

  it('sets the service log instance on the context as `log`', async () => {
    const log = {}
    instance = new Koa({
      app: {},
      log,
    })
    await instance.prepare(opts)

    expect(instance.instance.context).to.have.property('log', log)
  })

  it('applies config for the koa instance', async () => {
    // Sanity check
    expect(instance.instance).to.have.property('proxy', false)

    await instance.prepare({ config: {
      koa: { proxy: true },
    } })

    expect(instance.instance).to.have.property('proxy', true)
  })
})
