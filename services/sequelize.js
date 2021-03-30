const Sequelize = require('sequelize');

sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect:  'postgres',
  dialectOptions: {
    ssl: {
      rejectUnauthorized: false,
    }
  },
  protocol: 'postgres',
});

module.exports = sequelize;
