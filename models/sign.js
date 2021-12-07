const {
  DataTypes,
  Model,
} = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const {
  // saveSignDocument,
  destroySignDocument,
} = require('../services/elasticsearch-index-sign');


const _saveSignIndex = async (instance) => {
  console.log("saveSignDocumentsaveSignDocumentsaveSignDocumentsaveSignDocument")
  console.log("saveSignDocumentsaveSignDocumentsaveSignDocumentsaveSignDocument")
  console.log("saveSignDocumentsaveSignDocumentsaveSignDocumentsaveSignDocument")
  console.log("saveSignDocumentsaveSignDocumentsaveSignDocumentsaveSignDocument")
  console.log("saveSignDocumentsaveSignDocumentsaveSignDocumentsaveSignDocument")
  const include = [
    // { model: models.Location, as: 'Location' },
    // { model: models.Tag, as: 'Categories' },
  ];

  await instance.reload({ include });
  const body = instance.serialize();

  esClient.create({
    index: 'signs',
    id: sign.uid,
    body,
  }).then((result) => {
    console.log('resultresultresultresult', result);
    console.log('resultresultresultresult', result);
    console.log('resultresultresultresult', result);
    console.log('resultresultresultresult', result);
    console.log('resultresultresultresult', result);
  });
}

module.exports = (sequelize) => {
  class Sign extends Model {
    static associate(models) {
      this.associate = {
        user: Sign.belongsTo(models.User, {
          as: 'user',
        }),
        creator: Sign.belongsTo(models.User, {
          as: 'creator',
          foreignKey: 'userId',
        }),
        videos: Sign.hasMany(models.Video, {
          as: 'videos',
        }),
        topics: Sign.belongsToMany(models.Topic, {
          through: models.SignTopic,
          as: 'topics',
          foreignKey: 'sign_id',
        }),
      }
    }
  }
  Sign.init({
    uid: {
      allowNull: false,
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      unique: true,
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    pronounce: DataTypes.STRING,
    definition: DataTypes.TEXT,
    user_id: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    state: {
      type: DataTypes.ENUM,
      values: [
        'created',
        'drafted',
        'published',
      ],
    },
  }, {
    indexes: [{
      unique: true,
      fields: ['uid'],
    }],
    scopes: {
      serialize: {
        attributes: {
          exclude: [
            'id',
            'user_id',
            'userId',
            'UserId',
            'sign_id',
            'file_name',
            'createdAt',
            'updatedAt',
          ],
        },
      },
    },
    sequelize,
    modelName: 'Sign',
    tableName: 'Signs',
  });
  Sign.afterUpdate((instance) => {
    _saveSignIndex(instance)
  })
  return Sign;
};