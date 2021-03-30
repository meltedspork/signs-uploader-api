require('dotenv').config();

module.exports = {
  DATABASE_URL: process.env.DATABASE_URL,
  ORIGINS: process.env.SERVER_ORIGINS.split(','),
  PORT: process.env.PORT,
  PRODUCTION: (process.env.SERVER_ENVIRONMENT === 'production'),
};
