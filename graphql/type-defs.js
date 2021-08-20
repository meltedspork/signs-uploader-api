const { gql } = require('apollo-server-express');

const typeDefs = gql`
  directive @hasScope(scope: [String]) on FIELD_DEFINITION

  scalar Upload
  scalar UUID

  type Sign {
    uid: UUID!
    title: String
    pronounce: String
    definition: String
    state: String
    videoUrl: String
  }

  input SignInput {
    title: String
    pronounce: String
    definition: String
    videoFile: Upload
  }

  type Query {
    viewSign(uid: UUID!): Sign @hasScope(scope: ["read:signs"])
    allSigns: [Sign!]! @hasScope(scope: ["read:signs"])
  }

  type Mutation {
    createSign(signInput: SignInput): Sign
    updateSign(uid: UUID!, signInput: SignInput): Sign
  }
`;

module.exports = typeDefs;