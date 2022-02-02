const { esClient } = require('../config/elasticsearch.config');

const _buildDocumentObject = async (sign, { Sign, Topic, User, Video }) => {
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

  const docObj = {
    index: 'signs',
    id: sign.uid,
    body: serialized.toJSON(),
  };

  console.log("elasticsearch sign index: docObj", docObj);

  return docObj;
}

const saveSignDocument = async (sign, models) => {
  console.log('elasticsearch sign index: saveSignDocument: Start');

  docObj = _buildDocumentObject(sign, models);

  esClient.create(docObj).then((result) => {
    console.log('elasticsearch sign index: saveSignDocument: docObj', docObj.toJSON());
    console.log('elasticsearch sign index: saveSignDocument: result', result);
  });

  console.log("elasticsearch sign index: saveSignDocument: End");
}

const updateSignDocument = async (sign, models) => {
  console.log('elasticsearch sign index: updateSignDocument: Start');

  docObj = _buildDocumentObject(sign, models);

  esClient.update(docObj).then((result) => {
    console.log('elasticsearch sign index: updateSignDocument: docObj', docObj.toJSON());
    console.log('elasticsearch sign index: updateSignDocument: result', result);
  });

  console.log("elasticsearch sign index: updateSignDocument: End");
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
  updateSignDocument,
  destroySignDocument,
};