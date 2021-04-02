
const GraphQLUUID = require('graphql-type-uuid');

const resolvers = {
  UUID: GraphQLUUID,
  Query: {
    async sign (_root, { uid } , { models }) {
      return models.Sign.findOne({ where: { uid }});
    },
    async allSigns (_root, _args, { models }) {
      return models.Sign.findAll();
    },
  },
}

module.exports = resolvers;