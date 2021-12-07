const {
  DataTypes,
  Model,
} = require('sequelize');

module.exports = (sequelize) => {
  class SignTopic extends Model {}
  SignTopic.init({
    sign_id: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: 'Signs',
        key: 'signId',
      },
    },
    topic_id: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: 'Topics',
        key: 'topicId',
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
    modelName: 'SignTopic',
    tableName: 'SignTopics',
  });
  return SignTopic;
};