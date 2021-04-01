
const GraphQLUUID = require('graphql-type-uuid');

// const resolvers = {
//   Query: {
//     hello: () => 'Hello world!',
//   },
// };

const resolvers = {
  UUID: GraphQLUUID,
  Query: {
    async user (root, { id }, { models }) {
      return models.User.findById(id);
    },
    async allUsers (root, args, { models }) {
      console.log(models.User);
      return models.User.findAll();
    },
  },
}

module.exports = resolvers;