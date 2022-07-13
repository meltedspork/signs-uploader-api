const { esClient } = require('../config/elasticsearch.config');

const INDEX_NAME = 'signs';

const _buildCreateDocumentObject = async (sign) => {
  const parsedSerialized = await _buildDocumentObject(sign);
  const docObj = {
    index: INDEX_NAME,
    id: parsedSerialized.uid,
    body: parsedSerialized,
  };

  console.log('elasticsearch _buildCreateDocumentObject: docObj', docObj);
  return docObj;
}

const _buildUpdateDocumentObject = async (sign) => {
  const parsedSerialized = await _buildDocumentObject(sign);
  const docObj = {
    index: INDEX_NAME,
    id: parsedSerialized.uid,
    body: {
      doc: parsedSerialized,
    },
  };

  console.log('elasticsearch _buildUpdateDocumentObject: docObj', docObj);
  return docObj;
}

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

  return parsedSerialized;
}

const saveSignDocument = async (sign) => {
  console.log('elasticsearch sign index: saveSignDocument: Start');

  const docObj = await _buildCreateDocumentObject(sign);

  esClient.create(docObj).then((result) => {
    console.log('elasticsearch sign index: saveSignDocument: docObj', JSON.stringify(docObj));
    console.log('elasticsearch sign index: saveSignDocument: result', result);
  });

  console.log('elasticsearch sign index: saveSignDocument: End');
}

const updateSignDocument = async (sign) => {
  console.log('elasticsearch sign index: updateSignDocument: Start');

  const docObj = await _buildUpdateDocumentObject(sign);

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