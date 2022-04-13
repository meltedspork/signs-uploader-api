const { GraphQLUpload } = require('graphql-upload');
const GraphQLUUID = require('graphql-type-uuid');

const statusQueries = require('./status.query');
const signQueries = require('./sign.query');
const topicQueries = require('./topic.query');

const signMutations = require('./sign.mutation');
const topicMutations = require('./topic.mutation');
const videoMutations = require('./video.mutation');

const resolvers = {
  Upload: GraphQLUpload,
  UUID: GraphQLUUID,
  Query: {
    ...statusQueries,
    ...signQueries,
    ...topicQueries,
  },
  Mutation: {
    ...signMutations,
    ...topicMutations,
    ...videoMutations,
  },
};

module.exports = resolvers;
