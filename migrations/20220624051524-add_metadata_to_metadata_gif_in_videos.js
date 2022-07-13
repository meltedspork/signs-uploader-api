'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Videos', 'metadata_gif', {
      allowNull: true,
      type: Sequelize.JSONB,
    });
  },
};
