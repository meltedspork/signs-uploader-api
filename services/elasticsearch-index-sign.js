const { esClient } = require('../config/elasticsearch.config');
const { Sign, User, Video } = require('../models');

const saveSignDocument = async (sign) => {
  const seralized = await Sign.scope('serialize').findByPk(sign.id, {
    include: [
      {
        model: Video.scope('serialize'),
        as: 'videos',
      },
      {
        model: User.scope('serialize'),
        as: 'creator',
      },
    ],
  });

  console.log("saveSignDocumentsaveSignDocumentsaveSignDocumentsaveSignDocument: sign2", seralized);

  console.log("saveSignDocumentsaveSignDocumentsaveSignDocumentsaveSignDocument: sign: JSON", seralized.toJSON());

  esClient.create({
    index: 'signs',
    id: sign.uid,
    body: seralized.toJSON(),
  }).then((result) => {
    console.log('resultresultresultresult', result);
    console.log('resultresultresultresult', result);
    console.log('resultresultresultresult', result);
    console.log('resultresultresultresult', result);
    console.log('resultresultresultresult', result);
  });

  console.log("saveSignDocumentsaveSignDocumentsaveSignDocumentsaveSignDocument: End");

  // return sign;
}

const destroySignDocument = async (sign) => {
  const { uid: id } = sign;
  return esClient.documents.destroy({
    index: 'signs',
    id,
  });
}

module.exports = {
  saveSignDocument,
  destroySignDocument,
};