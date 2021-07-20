const {
  DataTypes,
  Model,
} = require('sequelize');
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize) => {
  class Video extends Model {
    // static associate(models) {
    //   // define association here
    // }
  }
  Video.init({
    uid: {
      allowNull: false,
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      unique: true,
    },
    title: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    file_name: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    user_id: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id',
        as: 'userId',
      }
    },
    sign_id: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: 'Signs',
        key: 'id',
        as: 'signId',
      }
    },
    metadata: {
      allowNull: false,
      type: DataTypes.JSONB,
    }
  }, {
    sequelize,
    modelName: 'Video',
  });
  return Video;
};