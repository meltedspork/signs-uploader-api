const {
  DataTypes,
  Model,
} = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const snakeCase = require('lodash/snakeCase');

const convertNameToValue = (topic) => {
  topic.value = snakeCase(topic.name);
}

module.exports = (sequelize) => {
  class Topic extends Model {
    static associate(models) {
      this.associate = {
        user: Topic.belongsTo(models.User, {
          as: 'user',
        }),
        creator: Topic.belongsTo(models.User, {
          as: 'creator',
          foreignKey: 'userId',
        }),
        signs: Topic.belongsToMany(models.Sign, {
          through: models.SignTopic,
          as: 'signs',
          foreignKey: 'topic_id',
        }),
      };
    }

    static findByUid(uid) {
      return Topic.findOne({ where: { uid }});
    }
  }
  Topic.init({
    uid: {
      allowNull: false,
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      unique: true,
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true,
    },
    value: {
      allowNull: false,
      type: DataTypes.TEXT,
      unique: true,
    },
    user_id: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
  }, {
    indexes: [{
      unique: true,
      fields: [
        'uid',
        'value',
      ],
    }],
    scopes: {
      serialize: {
        attributes: [
          'value',
        ],
      },
    },
    sequelize,
    modelName: 'Topic',
    tableName: 'Topics',
    hooks: {
      beforeSave: convertNameToValue,
      beforeUpdate: convertNameToValue,
    }
  });
  return Topic;
};