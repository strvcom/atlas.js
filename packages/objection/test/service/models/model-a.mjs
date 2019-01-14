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
    modelC: {
      relation: Model.ManyToManyRelation,
      modelClass: 'ModelC',
      join: {
        from: 'modela.modelDId',
        through: {
          from: 'modeld.id',
          to: 'modeld.modelCId',
          modelClass: 'ModelD',
        },
        to: 'modelc.id',
      },
    },
  }
}
