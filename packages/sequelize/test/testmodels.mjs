import { Model } from '..'

class User extends Model {
  static relations = {
    hasMany: {
      Purchase: {},
      Session: {},
    },
  }

  static fields = {}

  static config = {}
}

class Purchase extends Model {
  static relations = {
    belongsTo: {
      User: {},
    },
  }

  static fields = {}

  static config = {}
}

class Session extends Model {
  static relations = {}

  static fields = {}

  static config = {}
}

class Empty extends Model {}

export {
  User,
  Session,
  Purchase,
  Empty,
}
