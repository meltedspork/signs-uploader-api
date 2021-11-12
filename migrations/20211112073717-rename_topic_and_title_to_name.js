'use strict';

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.renameColumn('Signs', 'title', 'name');
    await queryInterface.renameColumn('Topics', 'topic', 'name');    
  },
};
