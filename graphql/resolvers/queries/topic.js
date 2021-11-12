const topicQueries = {
  async viewTopic (_root, { uid }, { models }) {
    const {
      name,
    } = await models.Topic.findOne({
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
    const { count, rows } = await models.Topic.findAndCountAll({ offset, limit });
    res.header('X-Pagination-Total', count);
    res.header('X-Pagination-Page', page);
    res.header('X-Pagination-Size', limit);
    const topics = rows.map(({
      dataValues: {
        uid,
        name,
      },
    }) => ({ uid, name }));
    return topics;
  }
};

module.exports = topicQueries;
