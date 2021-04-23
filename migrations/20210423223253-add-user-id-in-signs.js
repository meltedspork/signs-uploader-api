'use strict';
const { User } = require('../models');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // backfill
    await queryInterface.addColumn('Signs', 'user_id', {
      allowNull: false,
      type: Sequelize.INTEGER,
      defaultValue: User.findAll()[0],
    });
    await queryInterface.addColumn('Signs', 'user_id', {
      allowNull: false,
      type: Sequelize.INTEGER,
      defaultValue: null,
    });
  },
};
