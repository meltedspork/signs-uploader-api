const { signUrl } = require('../../../services/aws');
const signQueries = {
  async viewSign (_root, { uid }, { models, user }) {
    const {
      title,
      pronounce,
      definition,
      state,
    } = models.Sign.findOne({ where: { uid }});
    console.log('-------______uid', uid);

    const fileName = '243acb7b-d253-43e1-80be-b9fd27db365d';
    const videoUrl = signUrl(`${fileName}_Video.gif`);

    console.log('-------______videoUrl', videoUrl);

    return {
      title,
      pronounce,
      definition,
      state,
      videoUrl,
    };
  },
  async allSigns (_root, _args, { models }) {
    return models.Sign.findAll();
  },
};

module.exports = signQueries;
