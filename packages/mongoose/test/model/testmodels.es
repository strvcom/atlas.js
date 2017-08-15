import { Schema, SchemaTypes } from '../..'

const User = new Schema({
  name: SchemaTypes.String,
})

const Item = new Schema({
  name: SchemaTypes.String,
})

export {
  User,
  Item,
}
