'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Sentence extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Sentence.init({
    sentence: {
      allowNull: false,
      type: DataTypes.TEXT,
    },
    signId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    user_id: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'userId',
        // key: 'id,
        // as: 'userId',
      }
    },
  }, {
    sequelize,
    modelName: 'Sentence',
  });
  return Sentence;
};