import { ModelsHook } from '../..'
import * as testmodels from './testmodels'

describe('Mongoose: ModelsHook', () => {
  let hook
  let database

  beforeEach(() => {
    database = { model: sinon.spy() }
    hook = new ModelsHook({
      app: {
        root: __dirname,
      },
      log: { debug: () => {} },
      config: {
        module: 'testmodels',
      },
      resolve() { return database },
    })
  })


  it('exists', () => {
    expect(ModelsHook).to.be.a('function')
  })

  it('defines its defaults', () => {
    expect(ModelsHook.defaults).to.have.all.keys([
      'module',
    ])
  })

  it('defines its required components', () => {
    expect(ModelsHook.requires).to.eql([
      'service:mongoose',
    ])
  })

  it('implements `application:prepare:after`', () => {
    expect(hook).to.respondTo('application:prepare:after')
  })


  describe('application:prepare:after', () => {
    it('loads all models from the specified module location', async () => {
      await hook['application:prepare:after']()

      expect(database.model).to.have.callCount(2)
      expect(database.model.getCall(0).args[0]).to.equal('User')
      expect(database.model.getCall(0).args[1]).to.equal(testmodels.User)
      expect(database.model.getCall(1).args[0]).to.equal('Item')
      expect(database.model.getCall(1).args[1]).to.equal(testmodels.Item)
    })
  })
})
