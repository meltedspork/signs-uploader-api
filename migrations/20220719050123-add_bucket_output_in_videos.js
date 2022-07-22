'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Videos', 'bucket_output', {
      allowNull: true,
      type: Sequelize.JSONB,
    });
  },
};
