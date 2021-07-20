const { gql } = require('apollo-server-express');
const signTypeDefs = require('./sign');
const queryTypeDefs = require('./query');
const mutationTypeDefs = require('./mutation');

const typeDefs = gql`
  directive @hasScope(scope: [String]) on FIELD_DEFINITION

  scalar Upload
  scalar UUID

  ${signTypeDefs}

  ${queryTypeDefs}

  ${mutationTypeDefs}
`;

module.exports = typeDefs;