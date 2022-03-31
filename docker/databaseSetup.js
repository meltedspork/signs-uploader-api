const { sequelize } = require('../models');

(async () => {
  try {
    const uuid = sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

    console.log('EXTENSION:uuid', uuid);
  } catch (error) {
    console.log('error', error);
  }
})();
