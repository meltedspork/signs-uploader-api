'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'nickname', {
      type: Sequelize.STRING,
    });
  },
};
