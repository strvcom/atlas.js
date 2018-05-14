import path from 'path'
import { Atlas } from '@atlas.js/atlas'
import { ModelsHook } from '../..'
import * as testmodels from './testmodels'

describe('Mongoose: ModelsHook', () => {
  let hook
  let database

  beforeEach(() => {
    database = { model: sinon.spy() }
    hook = new ModelsHook({
      atlas: {
        root: __dirname,
        // eslint-disable-next-line global-require
        require: location => require(path.resolve(__dirname, location)),
      },
      log: { debug: () => {} },
      config: {
        module: 'testmodels',
      },
      component() { return database },
    })
  })


  it('exists', () => {
    expect(ModelsHook).to.be.a('function')
  })

  it('defines its config', () => {
    expect(ModelsHook.config).to.be.an('object')
  })

  it("default config passes component's schema validation", () => {
    const atlas = new Atlas({ root: __dirname })

    expect(() =>
      atlas.hook('models', ModelsHook, { aliases: { 'service:mongoose': 'db' } })).to.not.throw()
  })

  it('defines its required components', () => {
    expect(ModelsHook.requires).to.eql([
      'service:mongoose',
    ])
  })

  it('implements `afterPrepare`', () => {
    expect(hook).to.respondTo('afterPrepare')
  })


  describe('afterPrepare', () => {
    it('loads all models from the specified module location', async () => {
      await hook.afterPrepare()

      expect(database.model).to.have.callCount(2)
      expect(database.model.getCall(0).args[0]).to.equal('User')
      expect(database.model.getCall(0).args[1]).to.equal(testmodels.User)
      expect(database.model.getCall(1).args[0]).to.equal('Item')
      expect(database.model.getCall(1).args[1]).to.equal(testmodels.Item)
    })
  })
})
