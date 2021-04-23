require('dotenv').config();

const defaultOptions = {
  url: process.env.DATABASE_URL,
  dialect:  'postgres',
  protocol: 'postgres',
  define: {
    underscored: true,
  },
};

module.exports = {
  development: defaultOptions,
  production: Object.assign({}, defaultOptions, {
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
  }),
};
