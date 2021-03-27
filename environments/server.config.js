require('dotenv').config();

module.exports = {
  ORIGINS: process.env.ORIGINS.split(','),
  PORT: process.env.PORT,
  PRODUCTION: (process.env.ENVIRONMENT === 'production'),
};
