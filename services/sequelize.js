const environment = require('../environments');
const Sequelize = require('sequelize');

const sequelize = new Sequelize(environment.server.DATABASE_URL, {
  dialect:  'postgres',
  dialectOptions: {
    ssl: {
      rejectUnauthorized: false,
    }
  },
  protocol: 'postgres',
});

module.exports = sequelize;
