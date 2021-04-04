require('dotenv').config();
const Sequelize = require('sequelize');
const sequelizeConfigs = require(__dirname + '/../config/config');

const nodeEnv = process.env.NODE_ENV || 'development';

const sequelize = new Sequelize(
  process.env.DATABASE_URL,
  sequelizeConfigs[nodeEnv],
);

(async() => {
  try {
    await sequelize.authenticate();
    console.log('@!@!@!@! Sequelize authenticate has been established successfully.');
  } catch (error) {
    console.log('@!@!@!@! Unable to authenticate to the database:', error);
  }
})();

module.exports = {
  sequelize,
  Sequelize,
};
