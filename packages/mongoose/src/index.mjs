import mongoose from 'mongoose'
import Service from './service'
import ModelsHook from './models'

const Schema = mongoose.Schema
const SchemaTypes = mongoose.SchemaTypes

export {
  Service,
  ModelsHook,
  Schema,
  SchemaTypes,
  mongoose,
}
