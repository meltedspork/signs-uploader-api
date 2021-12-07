'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Topics', 'value', {
      allowNull: false,
      type: Sequelize.TEXT,
      unique: true,
    });
  },
};
