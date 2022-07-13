'use strict';

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.removeColumn('Videos', 'file_name');
  },
};
