const { esClient } = require('../../../config/elasticsearch.config');
const { signUrl } = require('../../../services/aws-s3-sign');

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
  async viewSigns (_root, { page }, { models }) {
    const limit = 3;
    const offset = page * limit;
    // const {
    //   hits: {
    //     total,
    //     hits,
    //   }
    // } = await esClient.search({
    //   index: 'signs',
    //   body: {
    //     size: 10,
    //     query: { match_all: {}},
    //     sort: [{ title: 'asc' }],
    //     search_after: [5],
    //   },
    // });
    // const signs = hits.map((hit) => {
    //   const {
    //     _id: uid,
    //     _source: {
    //       title,
    //       state,
    //     }
    //   } = hit;
    //   return {
    //     uid,
    //     title,
    //     state,
    //   }
    // });
    const { count, rows } = await models.Sign.findAndCountAll({ offset, limit });
    console.log('roooowsss')
    console.log('roooowsss')
    console.log('roooowsss')
    console.log('roooowsss', rows)
    return {
      pagination: {
        currentPage: page,
        limit,
        total: count, //total.value,
      },
      signs: rows, // signs,
    };
  },
};

module.exports = signQueries;
