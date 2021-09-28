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
  async signs (_root, _args, { models }) {
    // esClient.search({
    //   index: 'signs',
    //   body: {query: { match_all: {}}},
    // }).then((res) => {
    //   console.log('res::', res);
    //   console.log('res.hits::', res.hits);
    //   // console.log('res.hits.hits::', res.hits.hits);
    //   // console.log('res.hits.hits[0]._source::', res.hits.hits[0]._source);
    //   // console.log('res.hits.hits[1]._source::', res.hits.hits[1]._source);
    // }).catch((err) => { 
    //   console.log('ERROR::', err);
    // });

    const {
      hits: {
        hits
      }
    } = await esClient.search({
      index: 'signs',
      body: {query: { match_all: {}}},
    });
    const signs = hits.map((hit) => {
      const {
        _id: uid,
        _source: {
          // videos,: videoUrls
          title,
          pronounce,
          definition,
          state,
        }
      } = hit;
      let videoUrls = [];
      return {
        uid,
        videoUrls,
        title,
        pronounce,
        definition,
        state,
      }
    });
    console.log('signs', signs);
    console.log('STR###############################');
    console.log('STR###############################');
    console.log('STR###############################');
    console.log('STR###############################');
    console.log('STR###############################');
    console.log('STR###############################');
    console.log('STR###############################');
    console.log('STR###############################');
    console.log('STR###############################');
    console.log('STR###############################');
    console.log('hits###############################', hits)
    console.log('END###############################');

    const signs1 = await models.Sign.findAndCountAll({
      // offset: 1,
      // limit: 2,
    });
    console.log('signssignssigns:::::111')
    console.log('signssignssigns:::::', signs1);
    console.log('signssignssigns:::::222')
    // return signs.rows;
    return signs1.rows
  },
};

module.exports = signQueries;
