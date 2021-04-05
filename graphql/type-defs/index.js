const { gql } = require('apollo-server-express');
const signTypeDefs = require('./sign');
const queryTypeDefs = require('./query');
const mutationTypeDefs = require('./mutation');

const typeDefs = gql`
  scalar UUID

  ${signTypeDefs}

  ${queryTypeDefs}

  ${mutationTypeDefs}
`;

module.exports = typeDefs;