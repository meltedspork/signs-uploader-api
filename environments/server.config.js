require('dotenv').config();

module.exports = {
  DATABASE_URL: process.env.DATABASE_URL,
  NODE_ENV: process.env.NODE_ENV,
  ORIGINS: process.env.SERVER_ORIGINS.split(','),
  PORT: process.env.PORT,
  PRODUCTION: (process.env.NODE_ENV === 'production'),
};
