const { Topic } = require('../../../models');
const snakeCase = require('lodash/snakeCase');

const topicMutations = {
  async createTopic (_root, { topicInput }, { user }) {
    const {
      name,
    } = topicInput;

    const topicCreated = await Topic.create({
      name,
      value: snakeCase(name),
      user_id: user.id,
    });

    return topicCreated;
  },
  async updateTopic (_root, { uid, topicInput }) {
    const {
      name: nameInput,
    } = topicInput;
    const updatedTopic = await Topic.update({
      name: nameInput,
    }, {
      where: {
        uid,
      },
      returning: true,
      plain: true,
    });
    console.log('-------______updatedSign[1]', updatedTopic[1]);

    const { name } = updatedTopic[1];

    return {
      uid,
      name,
    };
  }
};

module.exports = topicMutations;
