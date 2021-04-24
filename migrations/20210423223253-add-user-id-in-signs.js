'use strict';
const { User } = require('../models');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Signs', 'user_id', {
      allowNull: false,
      type: Sequelize.INTEGER,
      defaultValue: null,
    });
  },
};
