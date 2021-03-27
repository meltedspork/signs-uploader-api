require('dotenv').config();

module.exports = {
  ORIGINS: process.env.SERVER_ORIGINS.split(','),
  PORT: process.env.SERVER_PORT || PORT,
  PRODUCTION: (process.env.SERVER_ENVIRONMENT === 'production'),
};
