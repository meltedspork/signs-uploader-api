'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('Videos', 'metadata', 'metadata_mov'); 
  },
};
