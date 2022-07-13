const {
  sequelize,
  Sign,
  Topic,
  Video,
} = require('../../models');
const { videoUpload } = require('../../services/video-pipeline-service');
const { saveSignDocument, updateSignDocument } = require('../../services/elasticsearch-index-sign');

const signMutations = {
  async createSign (_root, { signInput }, { user }) {
    const { id: userId } = user;
    console.log('createSign:::::: signInputsignInputsignInput', signInput);
    const {
      videoFile,
      name: nameInput,
      pronounce: pronounceInput,
      definition: definitionInput,
      topics: topicInputs,
    } = signInput;
    console.log('videoFilevideoFilevideoFile', videoFile);
    let transaction = await sequelize.transaction();

    try {
      const signCreated = await Sign.create({
        name: nameInput,
        pronounce: pronounceInput,
        definition: definitionInput,
        user_id: userId,
      }, { transaction });

      transaction = await _updateTopics(signCreated, transaction, topicInputs);

      if (videoFile) {
        transaction = await videoUpload(videoFile, transaction, userId, signCreated.id);
        console.log('transaction::::', transaction);
      }

      await transaction.commit();

      saveSignDocument(signCreated);
      const topics = await Topic.findAll();

      return {
        sign: signCreated,
        topics,
      };
    } catch(err) {
      console.log('Rolling back: ', err);
      transaction.rollback();
      throw err;
    }
  },
  async updateSign (_root, { uid, signInput }, { user }) {
    const { id: userId } = user;
    const {
      videoFile,
      name: nameInput,
      pronounce: pronounceInput,
      definition: definitionInput,
      topics: topicInputs,
    } = signInput;
    let transaction = await sequelize.transaction();

    try {
      const updatedSign = await Sign.update({
        name: nameInput,
        pronounce: pronounceInput,
        definition: definitionInput,
      }, {
        where: {
          uid,
        },
        returning: true,
        plain: true,
        transaction,
      });

      const { id: signId } = updatedSign[1];
      console.log('signId::::', signId);

      if (videoFile) {
        transaction = await videoUpload(videoFile, transaction, userId, signId);
        console.log('transaction::::', transaction);
      }

      transaction = await _updateTopics(updatedSign[1], transaction, topicInputs);

      await transaction.commit();

      console.log('-------______updatedSign', updatedSign)

      await updateSignDocument(updatedSign[1]);
      const foundUpdatedSign = await _findSign(updatedSign[1].id)
      const {
        definition,
        name,
        pronounce,
        state,
        topics,
        videos,
      } = foundUpdatedSign ;

      console.log('topics-topics: ', topics);
      console.log('videos-videos: ', videos);

      const allTopics = await Topic.findAll();

      return {
        sign: {
          uid,
          definition,
          name,
          pronounce,
          state,
          topics,
          videos,
        },
        topics: allTopics,
      };
    } catch(err) {
      console.log('Rolling back: ', err);
      await transaction.rollback();
      throw err;
    }
  }
};

const _updateTopics = async (instanceSignModel, transaction, topics) => {
  await instanceSignModel.setTopics(
    await Promise.all(
      topics.map((uid) => Topic.findByUid(uid))
    ),
    { transaction },
  );

  return transaction;
}

const _findSign = async (signId) => {
  const sign = await Sign.findByPk(signId, {
    include: [
      {
        model: Topic,
        as: 'topics',
        through: {
          attributes: [],
        },
      },
      {
        model: Video,
        as: 'videos',
      },
    ],
  });

  console.log('_findSign: sign', sign);
  return sign;
}

module.exports = signMutations;
