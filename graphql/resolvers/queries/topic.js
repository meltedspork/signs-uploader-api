const { Topic } = require('../../../models');

const topicQueries = {
  async viewTopic (_root, { uid }) {
    const {
      name,
    } = await Topic.findOne({
      where: {
        uid
      },
    });

    return {
      name,
    };
  },
  async viewTopics (_root, args, { res, models }) {
    const {
      page = 1,
      size: limit = 15,
    } = args;
    const offset = (page - 1) * limit;
    const { count, rows } = await Topic.findAndCountAll({ offset, limit });
    console.log('end topics: count', count);
    console.log('end topics: rows', rows);
    res.header('X-Pagination-Total', count);
    res.header('X-Pagination-Page', page);
    res.header('X-Pagination-Size', limit);
    const topics = rows.map(({
      dataValues: {
        uid,
        name,
      },
    }) => ({ uid, name }));
    console.log('end topics', topics);
    return topics;
  }
};

module.exports = topicQueries;
