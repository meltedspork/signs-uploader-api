const queryTypeDefs = `
type Query {
  sign(uid: UUID!): Sign
  allSigns: [Sign!]!
}
`;

module.exports = queryTypeDefs;
