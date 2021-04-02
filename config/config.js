const environment = require('../environments');

const defaultOptions = {
  url: environment.server.DATABASE_URL,
  dialect:  'postgres',
  protocol: 'postgres',
  define: {
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
}

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
