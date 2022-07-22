'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Videos', 'bucket_output', {
      allowNull: false,
      type: Sequelize.TEXT,
    });
  },
};
