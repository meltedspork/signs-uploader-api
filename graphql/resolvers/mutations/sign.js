const { sequelize } = require('../../../models');
const { uploadToBucket } = require('../../../services/aws-s3-sign');
const { saveSignDocument } = require('../../../services/elasticsearch-index-sign');

const signMutations = {
  async createSign (_root, { signInput }, { models, user }) {
    const {
      videoFile,
      name,
      pronounce,
      definition,
    } = signInput;
    console.log('videoFilevideoFilevideoFile', videoFile);
    const transaction = await sequelize.transaction()

    try {
      const signCreated = await models.Sign.create({
        name,
        pronounce,
        definition,
        user_id: user.id,
      }, { transaction });

      if (videoFile) {
        const videoFilePipedIn = await videoFile;
        const {
          filename,
          createReadStream,
        } = videoFilePipedIn || {};
        if (filename) {
          console.log('filename _______>', filename);
          const videoFileStreamed = createReadStream();
          console.log('filed _______>', videoFileStreamed);

          const uploadedToBucket = await uploadToBucket(videoFileStreamed, filename);
          console.log('uploadedToBucket _______>', uploadedToBucket);

          const videoCreated = await models.Video.create({
            title,
            file_name: filename,
            user_id: user.id,
            sign_id: signCreated.id,
            metadata: uploadedToBucket,
          }, { transaction });

          console.log('videoCreated!!!!!! ---', videoCreated);
        }
      }
      await transaction.commit();
      return signCreated;
    } catch(e) {
      console.log('Rolling back: ', err);
      await transaction.rollback();
      throw err;
    }
  },
  async updateSign (_root, { uid, signInput }, { models, user }) {
    console.log('signInput', signInput);
    const {
      name: nameInput,
      pronounce: pronounceInput,
      definition: definitionInput,
      topics: topicInputs,
    } = signInput;
    const transaction = await sequelize.transaction()
    console.log('topicInputs', topicInputs);

    try {
      const updatedSign = await models.Sign.update({
        name: nameInput,
        pronounce: pronounceInput,
        definition: definitionInput,
      }, {
        where: {
          uid,
        },
        include: [
          models.Topic,
        ],
        returning: true,
        plain: true,
        transaction,
      });
      await updatedSign[1].setTopics(
        await Promise.all(
          topicInputs.map(async (uid) => {
            return await models.Topic.findByUid(uid);
          })
        ),
        { transaction },
      );

      await transaction.commit();

      // console.log('-------______updatedSign[1]', updatedSign[1]);
      console.log('-------______updatedSign', updatedSign)

      saveSignDocument(updatedSign[1]);

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
        videoUrls: ['WOW videoUrl'],
      };
    } catch(err) {
      console.log('Rolling back: ', err);
      await transaction.rollback();
      throw err;
    }
  }
};

module.exports = signMutations;
