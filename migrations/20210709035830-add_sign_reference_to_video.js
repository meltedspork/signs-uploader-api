'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Videos', 'sign_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Signs',
        key: 'id',
        as: 'signId',
      }
    });
  },
};
