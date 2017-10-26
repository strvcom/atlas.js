import { Model } from '../../..'

export default class ModelA extends Model {
  static tableName = 'modela'
  static relationMappings = {
    modelb: {
      relation: Model.BelongsToOneRelation,
      modelClass: './model-b',
      join: {
        from: 'modela.modelb',
        to: 'modelb.id',
      },
    },
  }
}
