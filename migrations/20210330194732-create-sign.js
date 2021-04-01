'use strict';
const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Signs', {
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
      title: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      pronounce: {
        type: Sequelize.STRING,
      },
      definition: {
        type: Sequelize.TEXT,
      },
      state: {
        allowNull: false,
        type: Sequelize.ENUM,
        values: [
          'created',
          'drafted',
          'published',
        ],
        defaultValue: 'created',
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      }
    });
  },
};