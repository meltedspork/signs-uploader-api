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

    const signCreated = await models.Sign.create({
      name,
      pronounce,
      definition,
      user_id: user.id,
    });

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
        });

        console.log('videoCreated!!!!!! ---', videoCreated);
      }
    }

    return signCreated;
  },
  async updateSign (_root, { uid, signInput }, { models, user }) {
    console.log('signInput', signInput);
    const {
      name: nameInput,
      pronounce: pronounceInput,
      definition: definitionInput,
    } = signInput;
    const updatedSign = await models.Sign.update({
      name: nameInput,
      pronounce: pronounceInput,
      definition: definitionInput,
    }, {
      where: {
        uid,
      },
      returning: true,
      plain: true,
    });
    console.log('-------______updatedSign[1]', updatedSign[1]);

    saveSignDocument(updatedSign[1]);

    const {
      name,
      pronounce,
      definition,
      state,
    } = updatedSign[1];

    return {
      uid,
      name,
      pronounce,
      definition,
      state,
      videoUrls: ['WOW videoUrl'],
    };
  }
};

module.exports = signMutations;
