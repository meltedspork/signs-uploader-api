const { gql } = require('apollo-server-express');

const typeDefs = gql`
  directive @hasScope(scope: [String]) on FIELD_DEFINITION

  scalar Upload
  scalar UUID

  type Status {
    alive: Boolean
  }

  type Sign {
    uid: UUID!
    definition: String
    name: String
    pronounce: String
    state: String
    topics: [Topic]
    videos: [Video]
  }

  type Topic {
    uid: UUID
    name: String
    value: String
  }

  type Video {
    uid: UUID
    title: String
    src: String
  }

  type SignForm {
    sign: Sign!
    topics: [Topic!]
  }

  input SignInput {
    videoFile: Upload
    name: String
    pronounce: String
    definition: String
    topics: [String]
  }

  input TopicInput {
    uid: UUID
    name: String
  }

  type Query {
    viewStatus: Status @hasScope(scope: ["read:signs"])

    viewSign(uid: UUID): SignForm! @hasScope(scope: ["read:signs"])
    viewSigns(page: Int, size: Int): [Sign!]! @hasScope(scope: ["read:signs"])

    viewTopic(uid: UUID!): Topic! @hasScope(scope: ["read:signs"])
    viewTopics(page: Int, size: Int): [Topic!]! @hasScope(scope: ["read:signs"])
  }

  type Mutation {
    createSign(signInput: SignInput): SignForm! @hasScope(scope: ["write:signs"])
    updateSign(uid: UUID!, signInput: SignInput): SignForm! @hasScope(scope: ["write:signs"])

    createTopic(topicInput: TopicInput): Topic @hasScope(scope: ["write:signs"])
    updateTopic(uid: UUID!, topicInput: TopicInput): Topic @hasScope(scope: ["write:signs"])

    deleteVideo(uid: UUID!, signUid: UUID!): SignForm! @hasScope(scope: ["write:signs"])
  }
`;

module.exports = typeDefs;