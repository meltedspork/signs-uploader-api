const queryTypeDefs = `
type Query {
  viewSign(uid: UUID!): Sign @hasScope(scope: ["read:signs"])
  allSigns: [Sign!]! @hasScope(scope: ["read:signs"])
}
`;

module.exports = queryTypeDefs;
