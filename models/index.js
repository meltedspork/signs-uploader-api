const {
  sequelize,
  Sequelize,
} = require('../config/sequelize.config');

const SignModel = require('./sign');
const UserModel = require('./user');

const models = {
  Sign: SignModel(sequelize),
  User: UserModel(sequelize),
};

Object.values(models)
  .filter(model => typeof model.associate === "function")
  .forEach(model => model.associate(models));

const db = {
  ...models,
  sequelize,
  Sequelize,
};

module.exports = db;
