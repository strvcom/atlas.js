import { Model } from '../../..'

export default class ModelA extends Model {
  static tableName = 'modela'
  static relationMappings = {
    modelb: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'ModelB',
      join: {
        from: 'modela.modelBId',
        to: 'modelb.id',
      },
    },
  }
}
