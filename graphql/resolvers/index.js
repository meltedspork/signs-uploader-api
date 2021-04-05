const GraphQLUUID = require('graphql-type-uuid');
const Query = require('./queries');
const Mutation = require('./mutations');

const resolvers = {
  UUID: GraphQLUUID,
  Query,
  Mutation,
}

module.exports = resolvers;
