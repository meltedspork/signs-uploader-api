const { uploadToBucket } = require('../../../services/aws');

const signMutations = {
  async createSign (_root, args, { models, user }) {
    const {
      videoFile,
      title,
      pronounce,
      definition,
    } = args;
    console.log('!!!!!!!!!!!!!!!', args);
    console.log('videoFilevideoFilevideoFile', videoFile);
    console.log('useruseruseruseruseruser', user);

    const signCreated = await models.Sign.create({
      title,
      pronounce,
      definition,
      user_id: user.id,
    });

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
        metadata: {},
      });
    }

    return signCreated;
  }
};

module.exports = signMutations;
