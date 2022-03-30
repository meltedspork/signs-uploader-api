require('dotenv').config();
const elasticsearch = require('elasticsearch');
const logService = require('../services/log.service');

var client = new elasticsearch.Client({
  node: process.env.SEARCHBOX_URL
});

client.cluster.health({}, (err, resp, status) => { 
  logService.warn('elasticsearch health: ', {
    err,
    resp,
    status,
  });
});

client.indices.create({
  index: 'signs',
}, (err, resp, status) => {
  logService.warn('elasticsearch indexed for "signs": ', {
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
  logService.warn('elasticsearch mapping for "signs": ', {
    err,
    resp,
    status,
  });
});

module.exports = {
  esClient: client,
};
