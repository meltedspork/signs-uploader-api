
const GraphQLUUID = require('graphql-type-uuid');

const resolvers = {
  UUID: GraphQLUUID,
  Query: {
    async sign (_root, { uid } , /*{ models }*/ context) {
      const { models } = context;
      return models.Sign.findOne({ where: { uid }});
    },
    async allSigns (_root, _args, /*{ models }*/ context) {
      //console.log('context', context);
      const { models, user } = context;
      const { sub } = user;
      const foundUser = await models.User.findOne({ where: { idProviderUserId: sub }});
      console.log('USER!!!!>>>>>>>>>>>', foundUser);
      return models.Sign.findAll();
    },
  },
  Mutation: {
    async createSign (_root, args, { models }) {
      const {
        title,
        pronounce,
        definition,
      } = args;
      return models.Sign.create({
        title,
        pronounce,
        definition,
      })
    }
  }
}

module.exports = resolvers;