import Service from './service'
import ModelsHook from './models'
import * as mongoose from 'mongoose'
import { Schema, SchemaTypes } from 'mongoose'

declare module '@atlas.js/mongoose' {
  export {
    Service,
    ModelsHook,
    Schema,
    SchemaTypes,
    mongoose,
  }
}
