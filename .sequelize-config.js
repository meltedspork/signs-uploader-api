require('dotenv').config();

module.exports = {
  production: {
    url: process.env.DATABASE_URL,
    dialect:  'postgres',
    protocol: 'postgres',
    define: {
      underscored: true,
    },
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
  }
};
