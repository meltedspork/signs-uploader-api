const {
  DataTypes,
  Model,
} = require('sequelize');
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize) => {
  class User extends Model {
    static associate(models) {
      this.uploadedSign = models.User.hasMany(models.Sign, {
        as: 'uploadedSign',
        foreignKey: 'id',
      });
    }

    // findByIdpUserId(idProviderUserId) {
    // }
  }

  User.init({
    uid: {
      allowNull: false,
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      unique: true,
    },
    idProviderUserId: {
      type: DataTypes.STRING,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
    }
  }, {
    indexes: [{
      unique: true,
      fields: ['uid', 'id_provider_user_id'],
    }],
    sequelize,
    modelName: 'User',
    tableName: 'Users',
  });
  return User;
};