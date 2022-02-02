const { esClient } = require('../../../config/elasticsearch.config');
const { signUrl } = require('../../../services/aws-s3-sign');

const signQueries = {
  async viewSign (_root, { uid }, { models, user }) {
    const {
      definition,
      name,
      pronounce,
      state,
      topics,
      videos,
    } = await models.Sign.findOne({
      where: { uid },
      include: [
        'topics',
        'videos',
      ],
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

    const allTopics = await models.Topic.findAll();

    const signForm = {
      sign: {
        name,
        definition,
        pronounce,
        state,
        topics, //: topics.map(({ name, value }) => ({ name, value, })).flat(),
        videoUrls,
      },
      topics: allTopics,
    };
    console.log('signForm:', signForm);
    return signForm;
  },
  async viewSigns (_root, args, { res, models }) {
    const {
      page = 1,
      size: limit = 15,
    } = args;
    const offset = (page - 1) * limit;
    const {
      hits: {
        total,
        hits,
      }
    } = await esClient.search({
      index: 'signs',
      body: {
        size: limit,
        query: { match_all: {}},
        sort: { name: { order: 'asc' }},
        search_after: [offset],
      },
    });
    const signs = hits.map((hit) => {
      const {
        _id: uid,
        _source: {
          name,
          state,
        }
      } = hit;
      return {
        uid,
        name,
        state,
      }
    });

    res.header('X-Pagination-Total', total.value);
    res.header('X-Pagination-Page', page);
    res.header('X-Pagination-Size', limit);

    // const { count, rows } = await models.Sign.findAndCountAll({ offset, limit });
    // res.header('X-Pagination-Total', count);

    console.log('signs:', signs);

    return signs;
  }
};

module.exports = signQueries;
