require('dotenv').config();
const Sequelize = require('sequelize');

let postgresOptions = {
  url: process.env.DATABASE_URL,
  dialect:  'postgres',
  protocol: 'postgres',
  define: {
    underscored: true,
  },
};

if (process.env.NODE_ENV === 'production') {
  Object.assign(defaultOptions, {
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
    console.log('@!@!@!@! Sequelize authenticate has been established successfully.');
  } catch (error) {
    console.log('@!@!@!@! Unable to authenticate to the database:', error);
  }
})();

module.exports = {
  sequelize,
  Sequelize,
};
