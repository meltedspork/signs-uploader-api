'use strict';
const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()

    try {
      await queryInterface.createTable('Users', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        uid: {
          allowNull: false,
          type: Sequelize.UUID,
          defaultValue: DataTypes.UUIDV4,
          unique: true,
        },
        id_provider_user_id: {
          type: Sequelize.STRING,
          unique: true,
        },
        email: {
          type: Sequelize.STRING,
          unique: true,
        },
        created_at: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updated_at: {
          allowNull: false,
          type: Sequelize.DATE,
        }
      }, { transaction });

      await queryInterface.addIndex('Users', [
        'uid',
        'id_provider_user_id',
      ], { transaction });

      await transaction.commit();
    } catch (err) {
      console.log('Rolling back: ', err);
      await transaction.rollback();
      throw err;
    }
  },
};