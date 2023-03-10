'use strict';

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.removeColumn('Videos', 'bucket_output');
  },
};
