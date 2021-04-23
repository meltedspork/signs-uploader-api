const { GraphQLUpload } = require('graphql-upload');
const GraphQLUUID = require('graphql-type-uuid');
const Query = require('./queries');
const Mutation = require('./mutations');

const resolvers = {
  Upload: GraphQLUpload,
  UUID: GraphQLUUID,
  Query,
  Mutation,
};

module.exports = resolvers;
