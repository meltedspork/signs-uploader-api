'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Gloss extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Gloss.init({
    gloss: {
      allowNull: false,
      type: DataTypes.TEXT,
    },
    signId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: 'Signs',
        key: 'id',
        as: 'signId',
      }
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
  }, {
    sequelize,
    modelName: 'Gloss',
  });
  return Gloss;
};