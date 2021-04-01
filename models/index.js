const {
  sequelize,
  Sequelize,
} = require('../services/sequelize');

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
