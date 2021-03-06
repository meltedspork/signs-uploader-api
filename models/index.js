const {
  sequelize,
  Sequelize,
} = require('../config/sequelize.config');

const SignModel = require('./sign');
const UserModel = require('./user');
const VideoModel = require('./video');

const models = {
  Sign: SignModel(sequelize),
  User: UserModel(sequelize),
  Video: VideoModel(sequelize),
};

Object.values(models)
  .filter(model => typeof model.associate === 'function')
  .forEach(model => model.associate(models));

const db = {
  ...models,
  sequelize,
  Sequelize,
};

module.exports = db;
