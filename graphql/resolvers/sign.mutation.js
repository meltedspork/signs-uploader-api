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
    const {
      videoFile,
      name,
      pronounce,
      definition,
    } = signInput;
    console.log('videoFilevideoFilevideoFile', videoFile);
    let transaction = await sequelize.transaction();

    try {
      const signCreated = await Sign.create({
        name,
        pronounce,
        definition,
        user_id: userId,
      }, { transaction });

      if (videoFile) {
        transaction = videoUpload(videoFile, transaction, userId, signCreated.id);
      }

      await transaction.commit();

      saveSignDocument(signCreated);

      return signCreated;
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
        include: [
          Topic,
          Video,
        ],
        returning: true,
        plain: true,
        transaction,
      });

      const { id: signId } = updatedSign[1];
      console.log('signId::::', signId);

      if (videoFile) {
        transaction = await videoUpload(userId, signId, videoFile, transaction);
        // await videoUpload(userId, signId, videoFile, transaction);
      }

      await updatedSign[1].setTopics(
        await Promise.all(
          topicInputs.map(async (uid) => {
            return await Topic.findByUid(uid);
          })
        ),
        { transaction },
      );

      await transaction.commit();

      console.log('-------______updatedSign', updatedSign)

      await updateSignDocument(updatedSign[1]);

      const {
        definition,
        name,
        pronounce,
        state,
        topics,
      } = updatedSign[1];

      return {
        uid,
        definition,
        name,
        pronounce,
        state,
        topics,
        videos: [],
      };
    } catch(err) {
      console.log('Rolling back: ', err);
      await transaction.rollback();
      throw err;
    }
  }
};

module.exports = signMutations;
