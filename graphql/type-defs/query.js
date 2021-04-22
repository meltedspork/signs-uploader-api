const queryTypeDefs = `
type Query {
  viewSign(uid: UUID!): Sign
  allSigns: [Sign!]!
}
`;

module.exports = queryTypeDefs;
