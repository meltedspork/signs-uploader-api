const {
  DataTypes,
  Model,
} = require('sequelize');
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize) => {
  class Sign extends Model {
    static associate(models) {
      this.creator = models.Sign.hasOne(models.User, {
        as: 'creator',
        foreignKey: 'id',
      });
    }
  }
  Sign.init({
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
    pronounce: DataTypes.STRING,
    definition: DataTypes.TEXT,
    user_id: {
      allowNull: false,
      type: DataTypes.INTEGER,
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
    sequelize,
    modelName: 'Sign',
    tableName: 'Signs',
  });
  return Sign;
};