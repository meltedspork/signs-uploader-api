const signTypeDefs = `
type Sign {
  uid: UUID!
  title: String
  pronounce: String
  definition: String
  state: String
  videoUrl: String
}
`;

module.exports = signTypeDefs;
