const { makeExecutableSchema } = require('graphql-tools');
const typeDefs = require('./type-defs');
const resolvers = require('./resolvers');
const directiveResolvers = require('./directive-resolvers')

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
  directiveResolvers,
});

module.exports = schema;
