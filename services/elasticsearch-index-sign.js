const { esClient } = require('../config/elasticsearch.config');

const INDEX_NAME = 'signs';

const _buildDocumentObject = async (sign) => {
  const {
    Sign,
    Topic,
    User,
    Video,
  } = require('../models');
  const serialized = await Sign.scope('serialize').findByPk(sign.id, {
    include: [
      {
        model: Topic.scope('serialize'),
        as: 'topics',
        through: {
          attributes: [],
        },
      },
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

  const parsedSerialized = serialized.toJSON();
  console.log('elasticsearch sign index: parsedSerialized', parsedSerialized);

  const docObj = {
    index: INDEX_NAME,
    id: parsedSerialized.uid,
    body: {
      doc: parsedSerialized,
    },
  };

  console.log('elasticsearch sign index: docObj', docObj);

  return docObj;
}

const saveSignDocument = async (sign) => {
  console.log('elasticsearch sign index: saveSignDocument: Start');

  const docObj = await _buildDocumentObject(sign);

  esClient.create(docObj).then((result) => {
    console.log('elasticsearch sign index: saveSignDocument: docObj', JSON.stringify(docObj));
    console.log('elasticsearch sign index: saveSignDocument: result', result);
  });

  console.log('elasticsearch sign index: saveSignDocument: End');
}

const updateSignDocument = async (sign) => {
  console.log('elasticsearch sign index: updateSignDocument: Start');

  docObj = await _buildDocumentObject(sign);

  esClient.update(docObj).then((result) => {
    console.log('elasticsearch sign index: updateSignDocument: docObj', JSON.stringify(docObj));
    console.log('elasticsearch sign index: updateSignDocument: result', result);
  }).catch((error) => {
    console.log('elasticsearch sign index: updateSignDocument: error', error);
    saveSignDocument(sign);
  });

  console.log('elasticsearch sign index: updateSignDocument: End');
}

const destroySignDocument = async (sign) => {
  console.log('elasticsearch sign index: destroySignDocument: Start');
  console.log('elasticsearch sign index: destroySignDocument: sign:', sign);

  const result = await esClient.documents.destroy({
    index: INDEX_NAME,
    id: sign.uid,
  });

  console.log('elasticsearch sign index: destroySignDocument: result:', result);
  console.log('elasticsearch sign index: destroySignDocument: End');
}

module.exports = {
  saveSignDocument,
  updateSignDocument,
  destroySignDocument,
};