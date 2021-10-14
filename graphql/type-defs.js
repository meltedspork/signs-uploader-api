const { gql } = require('apollo-server-express');

const typeDefs = gql`
  directive @hasScope(scope: [String]) on FIELD_DEFINITION

  scalar Upload
  scalar UUID

  type Paging {
    current: Int
    total: Int
  }

  type Sign {
    uid: UUID!
    videoUrls: [String]
    title: String
    pronounce: String
    definition: String
    state: String
  }

  type Signs {
    paging: Paging
    signs: [Sign!]!
  }

  input SignInput {
    videoFile: Upload
    title: String
    pronounce: String
    definition: String
  }

  type Query {
    viewSign(uid: UUID!): Sign @hasScope(scope: ["read:signs"])
    viewSigns: Signs @hasScope(scope: ["read:signs"])
  }

  type Mutation {
    createSign(signInput: SignInput): Sign @hasScope(scope: ["write:signs"])
    updateSign(uid: UUID!, signInput: SignInput): Sign @hasScope(scope: ["write:signs"])
  }
`;

module.exports = typeDefs;