const Sequelize = require('sequelize');

sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect:  'postgres',
  protocol: 'postgres',
});

module.exports = sequelize;
