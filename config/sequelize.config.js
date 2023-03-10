require('dotenv').config();
const postgresOptions = require('../sequelize/config');

const Sequelize = require('sequelize');
const logService = require('../services/log.service');

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
