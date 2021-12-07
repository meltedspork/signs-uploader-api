'use strict';

module.exports = {
  up: async (queryInterface, _Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addIndex('Topics', ['value'], { transaction });
      await transaction.commit();
    } catch (err) {
      console.log('Rolling back: ', err);
      await transaction.rollback();
      throw err;
    }
  },
};
