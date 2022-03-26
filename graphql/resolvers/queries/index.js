const statusQueries = require('./status');
const signQueries = require('./sign');
const topicQueries = require('./topic');

const Query = {
  ...statusQueries,
  ...signQueries,
  ...topicQueries,
};

module.exports = Query;
