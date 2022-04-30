const { esClient } = require('../../config/elasticsearch.config');
const models = require('../../models');

const signQueries = {
  async viewSign (_root, { uid }) {
    let signForm = {};

    if (uid) {
      const sign = await models.Sign.findOne({
        where: {
          uid,
        },
        include: [
          'topics',
          'videos',
        ],
      });
      Object.assign(signForm, { sign });
    }

    const topics = await models.Topic.findAll();
    Object.assign(signForm, { topics });

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
