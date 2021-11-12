const signQueries = require('./sign');
const topicQueries = require('./topic');

const Query = {
  ...signQueries,
  ...topicQueries,
};

module.exports = Query;
