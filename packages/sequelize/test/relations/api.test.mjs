import { FrameworkError } from '@atlas.js/errors'
import Sequelize from 'sequelize'
import { RelationsHook } from '../..'
import * as testmodels from '../testmodels'

describe('Sequelize: RelationsHook', () => {
  let hook
  let database

  before(() => {
    database = new Sequelize('sqlite://test-db.sqlite', { operatorsAliases: {} })

    for (const Model of Object.values(testmodels)) {
      const config = {
        sequelize: database,
        ...Model.config,
      }

      Model.init(Model.fields, config)
    }
  })


  after(() =>
    database.close())

  beforeEach(() => {
    hook = new RelationsHook({
      atlas: {
        root: __dirname,
      },
      log: { debug() {} },
      config: {
        module: '../testmodels',
      },
      component() { return database },
    })
  })


  it('exists', () => {
    expect(RelationsHook).to.be.a('function')
  })

  it('defines its required components', () => {
    expect(RelationsHook.requires).to.eql([
      'service:sequelize',
    ])
  })

  it('implements `afterPrepare`', () => {
    expect(hook).to.respondTo('afterPrepare')
  })

  it('runs all the relations on all the models', async function() {
    const { User, Purchase, Session } = testmodels
    this.sandbox.stub(User, 'hasMany')
    this.sandbox.stub(Purchase, 'belongsTo')

    await hook.afterPrepare()

    expect(User.hasMany).to.have.callCount(2)
    expect(User.hasMany.getCall(0).args).to.eql([Purchase, User.relations.hasMany.Purchase])
    expect(User.hasMany.getCall(1).args).to.eql([Session, User.relations.hasMany.Session])

    expect(Purchase.belongsTo).to.have.callCount(1)
    expect(Purchase.belongsTo.getCall(0).args).to.eql([User, Purchase.relations.belongsTo.User])
  })

  it('throws when the relation type is invalid', () => {
    const User = testmodels.User

    User.relations.hasAProblem = { Purchase: {} }
    expect(() =>
      hook.afterPrepare()).to.throw(FrameworkError, /Invalid relation type/)

    delete User.relations.hasAProblem
  })

  it('throws when the related model does not exist', () => {
    const User = testmodels.User

    User.relations.hasMany.Problems = {}

    expect(() =>
      hook.afterPrepare()).to.throw(FrameworkError, /Invalid relation target/)

    delete User.relations.hasMany.Problems
  })

  it('does not throw when the model has no relations defined', () => {
    expect(() => {
      hook.afterPrepare()
    }).to.not.throw()
  })
})
