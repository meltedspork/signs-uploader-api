const { gql } = require('apollo-server-express');

const typeDefs = gql`
  scalar UUID

  type User {
    uid: UUID!
    idProviderUserId: String!
    email: String!
  }

  type Query {
    user(id: Int!): User
    allUsers: [User!]!
  }

`;

module.exports = typeDefs;