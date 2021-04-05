const mutationTypeDefs = `
type Mutation {
  createSign(title: String, pronounce: String, definition: String): Sign
}
`;

module.exports = mutationTypeDefs;
