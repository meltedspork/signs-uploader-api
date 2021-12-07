const {
  sequelize,
  Sequelize,
} = require('../config/sequelize.config');

const SignModel = require('./sign');
const SignTopicModel = require('./sign_topic');
const TopicModel = require('./topic');
const UserModel = require('./user');
const VideoModel = require('./video');

const models = {
  Sign: SignModel(sequelize),
  Topic: TopicModel(sequelize),
  SignTopic: SignTopicModel(sequelize),
  User: UserModel(sequelize),
  Video: VideoModel(sequelize),
};

Object.values(models)
  .filter(model => typeof model.associate === 'function')
  .forEach(model => model.associate(models));

module.exports = {
  sequelize,
  Sequelize,
  ...models,
};
