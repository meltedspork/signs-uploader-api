'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Videos', 'metadata_mov', {
      allowNull: true,
      type: Sequelize.JSONB,
    });
  },
};