require('dotenv').config();

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

module.exports = postgresOptions;
