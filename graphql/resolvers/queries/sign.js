const { signUrl } = require('../../../services/aws');
const signQueries = {
  async sign (_root, { uid }, { models }) {
    const {
      title,
      pronounce,
      definition,
      state,
    } = models.Sign.findOne({ where: { uid }});
    const signGifUrl = signUrl(`${uid}_Video.gif`);

    return {
      title,
      pronounce,
      definition,
      state,
      signGifUrl,
    }
  },
  async allSigns (_root, _args, { models, user }) {
    const { sub: idProviderUserId } = user;
    const foundUser = await models.User.findOne({
      where: {
        idProviderUserId
      },
    });

    // console.log('USER!!!!>>>>>>>>>>>', foundUser);
    return models.Sign.findAll();
  },
}

module.exports = signQueries;
