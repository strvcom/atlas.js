import Service from './service'
import MigrationAction from './migration'
import {
  compose,
  lit,
  mixin,
  ref,
  transaction,
  Model,
  NotFoundError,
  QueryBuilder,
  ValidationError
} from 'objection'
import * as objection from 'objection'

declare module '@atlas.js/objection' {

  export {
    Service,
    MigrationAction,

    compose,
    lit,
    mixin,
    ref,
    transaction,
    Model,
    NotFoundError,
    QueryBuilder,
    ValidationError,
    objection,
  }
}
