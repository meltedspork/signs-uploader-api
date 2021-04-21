const { uploadToBucket } = require('../../../services/aws');

const signMutations = {
  async createSign (_root, args, { models }) {
    const {
      videoFile,
      title,
      pronounce,
      definition,
    } = args;
    console.log('!!!!!!!!!!!!!!!', args);
    console.log('videoFilevideoFilevideoFile', videoFile);

    const {
      filename,
      createReadStream,
    } = await videoFile;
    console.log('filename _______>', filename);
    const filed = createReadStream();
    console.log('filed _______>', filed);

    const uploadedToBucket = await uploadToBucket(filed, filename);
    console.log('uploadedToBucket _______>', uploadedToBucket);
    return models.Sign.create({
      title,
      pronounce,
      definition,
    });
  }
}

module.exports = signMutations;
