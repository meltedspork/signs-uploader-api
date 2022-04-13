const { esClient } = require('../../config/elasticsearch.config');
const models = require('../../models');
const { signUrl } = require('../../services/aws-s3-sign');

const signQueries = {
  async viewSign (_root, { uid }) {
    let signForm = {};

    if (uid) {
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

      vids = videos.map((video) => {
        const {
          metadata: {
            key,
          }
        } = video;
        const filename = key.split('.')[0];
        return {
          uid: filename,
          title: key,
          src: signUrl(`${uid}.gif`),
        };
      });

      const uidMock = '795eb62a-696e-4973-857d-8fc28be480cf';
      const urlMock = signUrl(`${uid}_k8s.gif`);
      vids.push({
        uid: uidMock,
        title: 'foobarkey',
        src: urlMock,
      });
      // vids.push(videoUrl);
      console.log('-------______vids', vids);

      Object.assign(signForm, {
        sign: {
          name,
          definition,
          pronounce,
          state,
          topics, //: topics.map(({ name, value }) => ({ name, value, })).flat(),
          videos: vids,
        },
      });
    }

    const allTopics = await models.Topic.findAll();
    Object.assign(signForm, {
      topics: allTopics,
    });

    console.log('signForm:', signForm);
    return signForm;
  },
  async viewSigns (_root, args, { res }) {
    const {
      page = 1,
      size: limit = 15,
    } = args;
    const offset = (page - 1) * limit;
    let totalValue = 0;
    let signs = [];
    
    const results = await esClient.search({
      body: {
        from: offset,
        size: limit,
        query: { match_all: {}},
        sort: [
          { name: { order: 'asc' }},
        ],
      }
    });
    console.log('results----->>>', results);
    if (!!results && !!results.body && !!results.body.hits) {
      const {
        body: {
          hits: {
            total,
            hits,
          },
        },
      } = results;
      totalValue = total.value;
      signs = hits.map(({
        _id: uid,
        _source: {
          name,
          state,
        }
      }) => {
        return {
          uid,
          name,
          state,
        }
      });
      console.log('signs:', signs);
    }

    res.header('X-Pagination-Total', totalValue);
    res.header('X-Pagination-Page', page);
    res.header('X-Pagination-Size', limit);

    return signs;

    // NOTE: SQL query as backup
    // const { count, rows } = await models.Sign.findAndCountAll({ offset, limit, order: [['name', 'ASC']] });
    // res.header('X-Pagination-Total', count);
    // return rows;
  }
};

module.exports = signQueries;