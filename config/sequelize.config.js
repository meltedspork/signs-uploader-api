require('dotenv').config();
const Sequelize = require('sequelize');
const logService = require('../services/log.service');

let postgresOptions = {
  url: process.env.DATABASE_URL,
  dialect:  'postgres',
  protocol: 'postgres',
  define: {
    underscored: true,
  },
};

if (process.env.NODE_ENV === 'production') {
  Object.assign(postgresOptions, {
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
  });
}

const sequelize = new Sequelize(
  process.env.DATABASE_URL,
  postgresOptions,
);

(async() => {
  try {
    await sequelize.authenticate();
    logService.info('@!@!@!@! Sequelize authenticate has been established successfully.');
  } catch (error) {
    logService.error('@!@!@!@! Unable to authenticate to the database:', error);
  }
})();

module.exports = {
  sequelize,
  Sequelize,
};
