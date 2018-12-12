import * as path from 'path'
import * as Koa from 'koa'
import { Server as Service } from '../..'
import * as testmiddleware from './testmiddleware'

describe('Koa::prepare()', () => {
  let service
  let instance
  let atlas
  let config


  beforeEach(async function() {
    this.sandbox.stub(Koa.prototype, 'use')
    atlas = {
      // eslint-disable-next-line global-require
      require: location => require(path.resolve(__dirname, location)),
    }
    config = {
      middleware: {
        module: 'testmiddleware',
      },
    }
    service = new Service({
      atlas,
      config,
      log: {},
    })


    instance = await service.prepare()
  })

  afterEach(() => {
    Koa.prototype.use.resetHistory()
    for (const middleware of Object.values(testmiddleware)) {
      middleware.resetHistory()
    }
  })


  it('exists', () => {
    expect(service).to.respondTo('prepare')
  })

  it('returns the koa instance', async () => {
    expect(await service.prepare()).to.be.instanceof(Koa)
  })

  it('sets env on the koa instance based on the env of the atlas instance', async () => {
    atlas.env = 'dummy'
    service = new Service({
      atlas,
      config,
    })
    instance = await service.prepare()

    expect(instance.env).to.equal('dummy')
  })

  it('sets the Atlas instance on the context as `atlas`', () => {
    expect(instance.context).to.have.property('atlas', atlas)
  })

  it('sets the service log instance on the context as `log`', async () => {
    const log = {}
    service = new Service({
      atlas,
      config,
      log,
    })
    instance = await service.prepare()

    expect(instance.context).to.have.property('log', log)
  })

  it('loads all exported middleware from the specified module into Koa', () => {
    expect(testmiddleware.first).to.have.callCount(1)
    expect(testmiddleware.second).to.have.callCount(1)
    expect(Koa.prototype.use).to.have.callCount(2)
  })

  it('passes the provided middleware config to the middleware', async () => {
    config.middleware.config = {
      first: { firsttest: true },
      second: { secondtest: true },
    }

    await service.prepare()

    const args = {
      first: testmiddleware.first.lastCall.args[0],
      second: testmiddleware.second.lastCall.args[0],
    }

    expect(args.first).to.eql({ firsttest: true })
    expect(args.second).to.eql({ secondtest: true })
  })
})
