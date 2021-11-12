'use strict';
const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Topics', 'uid', {
      allowNull: false,
      type: Sequelize.UUID,
      defaultValue: DataTypes.UUIDV4,
      unique: true,
    });
  },
};
