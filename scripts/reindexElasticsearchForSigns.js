const models = require('../models');
const { updateSignDocument } = require('../services/elasticsearch-index-sign');

(async () => {
  try {
    const signs = await models.Sign.findAll({
      attributes: [
        'id',
        'uid',
      ],
      // offset: 0,
      // limit: 1,
    });
    console.log('signs', signs);
    signs.forEach(({ id, uid }) => updateSignDocument({ id, uid }, models));
  } catch (error) {
    console.log('error', error);
  }
})();


/*

(async() => { await esClient.indices.delete({index: 'signs'}) })();

*/