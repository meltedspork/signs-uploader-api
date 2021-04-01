const {
  DataTypes,
  Model,
} = require('sequelize');
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize) => {
  class Sign extends Model {
    static associate(models) {
      //this.users = models.Sign.hasMany(models.User);
    }
  };
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
    state: {
      type: DataTypes.ENUM,
      values: [
        'created',
        'drafted',
        'published',
      ],
    },
  }, {
    sequelize,
    modelName: 'Sign',
  });
  return Sign;
};