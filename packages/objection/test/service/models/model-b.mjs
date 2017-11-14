import { Model } from '../../..'

export default class ModelB extends Model {
  static tableName = 'modelb'
  static relationMappings = {
    modela: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'ModelA',
      join: {
        from: 'modelb.modela',
        to: 'modela.id',
      },
    },
  }
}
