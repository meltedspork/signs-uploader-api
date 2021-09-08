const { uploadToBucket } = require('../../../services/aws');

const signMutations = {
  async createSign (_root, { signInput }, { models, user }) {
    const {
      videoFile,
      title,
      pronounce,
      definition,
    } = signInput;
    console.log('videoFilevideoFilevideoFile', videoFile);
    console.log('useruseruseruseruseruser', user);

    const signCreated = await models.Sign.create({
      title,
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
    console.log('UPDDDATTEEEDDDDD!!!!!!');
    console.log('UPDDDATTEEEDDDDD!!!!!!');
    console.log('UPDDDATTEEEDDDDD!!!!!!');
    console.log('UPDDDATTEEEDDDDD!!!!!!');
    console.log('-------______user', user);
    console.log('-------______uid', uid);
    console.log('-------______signInput', signInput);
    const {
      title: titleInput,
      pronounce: pronounceInput,
      definition: definitionInput,
    } = signInput;
    const updatedSign = await models.Sign.update({
      title: titleInput,
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
    const {
      title,
      pronounce,
      definition,
      state,
    } = updatedSign[1];

    return {
      uid,
      title,
      pronounce,
      definition,
      state,
      videoUrl: 'WOW videoUrl',
    };
  }
};

module.exports = signMutations;
