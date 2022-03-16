require('dotenv').config();
const elasticsearch = require('@elastic/elasticsearch');

const node = process.env.SEARCHBOX_URL;

var client = new elasticsearch.Client({ node });

client.cluster.health({}, (err, resp, status) => { 
  console.log('elasticsearch health: ', {
    err,
    resp,
    status,
  });
});

client.indices.create({
  index: 'signs',
}, (err, resp, status) => {
  console.log('elasticsearch indexed for "signs": ', {
    err,
    resp,
    status,
  });
});

client.indices.putMapping({
  index: 'signs',
  body: {
    properties: {
      uid: {
        type: 'keyword',
      },
      name: {
        type: 'keyword',
      },
      pronounce: {
        type: 'text',
      },
      definition: {
        type: 'text',
      },
      user_id: {
        type: 'keyword',
      },
      state: {
        type: 'text',
      },
    },
  },
}, (err, resp, status) => {
  console.log('elasticsearch mapping for "signs": ', {
    err,
    resp,
    status,
  });
});

module.exports = {
  esClient: client,
};
