const signMutations = require('./sign');
const topicMutations = require('./topic');

const Mutation = {
  ...signMutations,
  ...topicMutations,
};

module.exports = Mutation;
