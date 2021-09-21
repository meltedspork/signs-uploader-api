const { gql } = require('apollo-server-express');

const typeDefs = gql`
  directive @hasScope(scope: [String]) on FIELD_DEFINITION

  scalar Upload
  scalar UUID

  type Sign {
    uid: UUID!
    videoUrls: [String]
    title: String
    pronounce: String
    definition: String
    state: String
  }

  input SignInput {
    videoFile: Upload
    title: String
    pronounce: String
    definition: String
  }

  type Query {
    viewSign(uid: UUID!): Sign @hasScope(scope: ["read:signs"])
    signs: [Sign!]! @hasScope(scope: ["read:signs"])
  }

  type Mutation {
    createSign(signInput: SignInput): Sign
    updateSign(uid: UUID!, signInput: SignInput): Sign
  }
`;

module.exports = typeDefs;