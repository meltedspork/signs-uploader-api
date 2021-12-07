'use strict';
const { Topic } = require('../models');

module.exports = {
  up: async () => {
    const topics = await Topic.findAll({
      where: {
        value: null,
      },
    });
    topics.forEach(async (topic) => {
      topic = await topic.update({
        name: topic.name,
      });
      console.log('topic:', topic);
    });
    return topics;
  },
};
