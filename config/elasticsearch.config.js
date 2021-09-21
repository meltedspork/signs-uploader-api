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

module.exports = {
  esClient: client,
};
