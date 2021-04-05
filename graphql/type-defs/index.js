const { gql } = require('apollo-server-express');
const signTypeDefs = require('./sign.type-defs');
const queryTypeDefs = require('./query.type-defs');
const mutationTypeDefs = require('./mutation.type-defs');

const typeDefs = gql`
  scalar UUID

  ${signTypeDefs}

  ${queryTypeDefs}

  ${mutationTypeDefs}
`;

module.exports = typeDefs;