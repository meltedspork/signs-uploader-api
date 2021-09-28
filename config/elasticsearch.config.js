require('dotenv').config();
const elasticsearch = require('elasticsearch');

const host = process.env.SEARCHBOX_URL;

var client = new elasticsearch.Client({ host });

client.cluster.health({}, (err, resp, status) => { 
  console.log('elasticsearch health: ', {
    err,
    resp,
    status,
  });
});

client.indices.create({ index: 'signs' }, (err, resp, status) => {
  console.log('elasticsearch indexed for "signs": ', {
    err,
    resp,
    status,
  });
});

module.exports = {
  esClient: client,
};
