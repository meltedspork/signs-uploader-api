const {
  DataTypes,
  Model,
} = require('sequelize');
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Sign, {
        as: 'signs',
      })
      // this.uploadedSign = models.User.hasMany(models.Sign, {
      //   as: 'uploadedSign',
      //   foreignKey: 'id',
      // });
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
    nickname: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique: true,
    }
  }, {
    indexes: [{
      unique: true,
      fields: ['uid', 'id_provider_user_id'],
    }],
    scopes: {
      serialize: {
        attributes: {
          exclude: [
            'id',
            'idProviderUserId',
            'email',
            'createdAt',
            'updatedAt',
            'file_name',
          ],
        },
      },
    },
    sequelize,
    modelName: 'User',
    tableName: 'Users',
  });
  return User;
};