const GraphQLUUID = require('graphql-type-uuid');
const Query = require('./query-resolvers');
const Mutation = require('./mutation-resolvers');

const resolvers = {
  UUID: GraphQLUUID,
  Query,
  Mutation,
}

module.exports = resolvers;
