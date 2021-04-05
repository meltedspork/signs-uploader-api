const signMutations = {
  async createSign (_root, args, { models }) {
    const {
      title,
      pronounce,
      definition,
    } = args;
    return models.Sign.create({
      title,
      pronounce,
      definition,
    })
  }
}

module.exports = signMutations;
