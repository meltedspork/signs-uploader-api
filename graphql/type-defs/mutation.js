const mutationTypeDefs = `
type Mutation {
  createSign(
    videoFile: Upload,
    title: String,
    pronounce: String,
    definition: String,
  ): Sign
}
`;

module.exports = mutationTypeDefs;
