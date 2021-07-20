'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Videos', 'user_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Users',
        key: 'id',
        as: 'userId',
      }
    });
    await queryInterface.renameColumn('Videos', 'createdAt', 'created_at');
    await queryInterface.renameColumn('Videos', 'updatedAt', 'updated_at');    
  },
};
