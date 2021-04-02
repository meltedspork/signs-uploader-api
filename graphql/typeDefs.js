const { gql } = require('apollo-server-express');

const typeDefs = gql`
  scalar UUID

  type Sign {
    uid: UUID!
    title: String!
    pronounce: String!
    definition: String!
    state: String!
  }

  type Query {
    sign(uid: UUID!): Sign
    allSigns: [Sign!]!
  }
`;

module.exports = typeDefs;