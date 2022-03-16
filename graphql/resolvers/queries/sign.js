const { esClient } = require('../../../config/elasticsearch.config');
const { signUrl } = require('../../../services/aws-s3-sign');
const {
  createPointInTime,
  deletePointInTime,
 } = require('../../../services/elasticsearch-index-sign');

const signQueries = {
  async viewSign (_root, { uid }, { session, models, user }) {
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

    console.log('------->>>>> session', session);
    return signForm;
  },
  async viewSigns (_root, args, { res, models, session }) {
    const {
      page = 1,
      size: limit = 15,
    } = args;
    const offset = (page - 1) * limit;

    console.log('------->>>>> session', session);
  
    let {
      pidId: pointInTimeId = null,
      searchAfter,
    } = session;
    if (!pointInTimeId || page === 1) {
      pointInTimeId = await createPointInTime();
    //  searchAfter = null;
    }
    console.log('pointInTimeId:', pointInTimeId);
    console.log('searchAfter:', searchAfter);
    // TODO: figure out why this isn't working
    // let searchQuery = {
    //   size: 15,
    //   query: { match_all: {}},
    //   pit: {
    //     id: pointInTimeId,
    //     keep_alive: '1m',
    //   },
    //   sort: [
    //     { name: { order: 'asc' }},
    //     // { _shard_doc: 'desc' },
    //   ],
    // }
    // let updatedSearchQuery = {}
    // if (page === 1) {
    //   searchAfter = null;
    //   updatedSearchQuery = searchQuery;
    // } else if (!!searchAfter) {
    //   updatedSearchQuery = {
    //     ...searchQuery,
    //     search_after: searchAfter,
    //   };
    // } else {
    //   updatedSearchQuery = searchQuery;
    // }
    let searchQuery = {
      from: offset,
      size: 15, // limit,
      query: { match_all: {}},
      // pit: {
      //   id: pointInTimeId,
      //   keep_alive: '1m',
      // },
      sort: [
        // { _shard_doc: 'asc' },
        { name: { order: 'asc' }},
        // { _shard_doc: 'desc' },
      ],
        // ...(searchAfter !== null && { search_after: [searchAfter] }),
        // // search_after: [searchAfter],
    }

    updatedSearchQuery = searchQuery;
  
    const {
      pit_id: pidId,
      body: {
        hits,
      }
    } = await esClient.search({ body: updatedSearchQuery });
    console.log('hits:', hits);
    const {
      total,
      hits: results,
    } = hits;
    const signs = results.map(({
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

    searchAfter = results[results.length - 1].sort;
    console.log('searchAfter:', searchAfter);

    session.searchAfter = searchAfter;
    session.pidId = pidId;
    res.header('X-Pagination-Total', total.value);
    res.header('X-Pagination-Page', page);
    res.header('X-Pagination-Size', limit);

    // if (pointInTimeId) {
    //   await deletePointInTime(pointInTimeId);
    // }

    // const { count, rows } = await models.Sign.findAndCountAll({ offset, limit, order: [['name', 'ASC']] });
    // res.header('X-Pagination-Total', count);
    console.log('updatedSearchQuery:', updatedSearchQuery);
    // return rows;
    return signs;
  }
};

module.exports = signQueries;
