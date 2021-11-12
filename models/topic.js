const {
  DataTypes,
  Model,
} = require('sequelize');
const { v4: uuidv4 } = require('uuid');

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
        videos: Topic.hasMany(models.Sign, {
          as: 'signs',
        }),
      }
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
      fields: ['uid'],
    }],
    scopes: {
      serialize: {
        attributes: {
          exclude: [
            'id',
            'createdAt',
            'updatedAt',
          ],
        },
      },
    },
    sequelize,
    modelName: 'Topic',
    tableName: 'Topics',
  });
  return Topic;
};