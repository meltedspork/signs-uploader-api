'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Topics', 'value', {
      allowNull: true,
      type: Sequelize.TEXT,
      unique: true,
    });
  },
};