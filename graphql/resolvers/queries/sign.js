const { signUrl } = require('../../../services/aws');
const signQueries = {
  async viewSign (_root, { uid }, { models, user }) {
    const {
      title,
      pronounce,
      definition,
      state,
      videos,
    } = await models.Sign.findOne({
      where: {
        uid
      },
      include: {
        model: models.Video,
        as: 'videos',
      },
    });

    videoUrls = videos.map((video) => {
      const {
        metadata: {
          key,
        }
      } = video;
      const fileName = key.split('.')[0];
      return signUrl(`${fileName}.gif`);
    });

    const fileName = '795eb62a-696e-4973-857d-8fc28be480cf';
    const videoUrl = signUrl(`${fileName}_k8s.gif`);
    videoUrls.push(videoUrl);
    console.log('-------______videoUrls', videoUrls);

    return {
      title,
      pronounce,
      definition,
      state,
      videoUrls,
    };
  },
  async allSigns (_root, _args, { models }) {
    return models.Sign.findAll();
  },
};

module.exports = signQueries;
