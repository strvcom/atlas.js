import { ModelsHook } from '../..'
import objection from 'objection'
import knex from 'knex'
import * as mixins from '../../src/mixins'
import moment from 'moment-timezone'

describe('objection:mixins for modelsHook', () => {
  let database
  let hook

  before(() => {
    const connection = knex({
      connection: {
        filename: './mydb.sqlite',
      },
      useNullAsDefault: true,
      client: 'sqlite3',
    })
    objection.Model.knex(connection)
    database = { objection }
  })

  after(() => database.objection.Model.knex().destroy())

  beforeEach(() => {
    hook = new ModelsHook({
      app: {
        root: __dirname,
      },
      log: { debug() {} },
      config: {
        module: '../testmodels',
      },
      resolve() { return database },
    })
  })

  it('checks CamelCaseTransformMixin - snake_case - camelCase transform', async () => {
    await hook['application:prepare:after']()
    const user = database.models.user
    // eslint-disable-next-line camelcase
    const dbRow = { user_type_id: 1 }
    const appRow = { userTypeId: 1 }
    expect(user.prototype.$parseDatabaseJson(dbRow)).to.eql(appRow)
    expect(user.prototype.$formatDatabaseJson(appRow)).to.eql(dbRow)
  })

  it('checks TimestampsMixin factory function - proper chaining', () => {
    const mixin = mixins.makeTimestampsMixin({ timestamps: true })
    const Model = database.objection.Model
    expect(mixin).to.be.a('function')
    const MyModel = mixin(Model)
    expect(MyModel).to.be.a('function')

    // MyModel extends Model class
    expect(Model).to.respondTo('$beforeInsert')
    expect(MyModel).to.respondTo('$beforeInsert')
    expect(MyModel).itself.not.to.respondTo('$beforeInsert')
  })

  it('sets both flags in $beforeInsert() if timestamps=true option is set', () => {
    const mixin = mixins.makeTimestampsMixin({ timestamps: true })
    const Model = database.objection.Model
    const MyModel = mixin(Model)
    // instance gets timestamps set
    const instance = new MyModel()
    instance.$beforeInsert()
    expect(instance.createdAt).to.be.a('string')
    expect(moment(instance.createdAt).isValid()).to.equal(true)
    expect(instance.updatedAt).to.be.a('string')
    expect(moment(instance.updatedAt).isValid()).to.equal(true)
  })

  it('sets updatedAt in $beforeUpdate() if timestamps=true option is set', () => {
    const mixin = mixins.makeTimestampsMixin({ timestamps: true })
    const Model = database.objection.Model
    const MyModel = mixin(Model)
    // instance gets timestamps set
    const instance = new MyModel()
    instance.$beforeUpdate()
    expect(instance.createdAt).to.be.an('undefined')
    expect(instance.updatedAt).to.be.a('string')
    expect(moment(instance.updatedAt).isValid()).to.equal(true)
  })

  it('sets nothing if timestamps=false option is set', () => {
    const mixin = mixins.makeTimestampsMixin({ timestamps: false })
    const Model = database.objection.Model
    const MyModel = mixin(Model)
    // instance gets timestamps set
    const instance = new MyModel()
    instance.$beforeInsert()
    expect(instance.createdAt).to.be.an('undefined')
    expect(instance.updatedAt).to.be.an('undefined')

    instance.$beforeUpdate()
    expect(instance.updatedAt).to.be.an('undefined')
  })

  it('sets nothing if timestamps option is omitted -> it is false by default', () => {
    const mixin = mixins.makeTimestampsMixin()
    const Model = database.objection.Model
    const MyModel = mixin(Model)
    // instance gets timestamps set
    const instance = new MyModel()
    instance.$beforeInsert()
    expect(instance.createdAt).to.be.an('undefined')
    expect(instance.updatedAt).to.be.an('undefined')

    instance.$beforeUpdate()
    expect(instance.updatedAt).to.be.an('undefined')
  })
})
