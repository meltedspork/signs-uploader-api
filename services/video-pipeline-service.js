const { Video } = require('../models');
const { uploadToBucket } = require('./aws-s3-sign');

const videoUpload = async (userId, signId, videoFile, transaction) => {
  console.log('videoUpload!!!!!! --- videoFile:', videoFile);
  console.log('videoUpload!!!!!! --- userId:', userId);
  console.log('videoUpload!!!!!! --- signId:', signId);
  const videoFilePipedIn = await videoFile;
  const {
    filename,
    createReadStream,
  } = videoFilePipedIn || {};

  if (filename && createReadStream) {
    console.log('filename _______>', filename);
    const videoFileStreamed = createReadStream();
    console.log('filed _______>', videoFileStreamed);

    const uploadedToBucket = await uploadToBucket(videoFileStreamed, filename);
    console.log('uploadedToBucket _______>', uploadedToBucket);

    const videoCreated = await Video.create({
      title: filename,
      file_name: uploadedToBucket.key,
      user_id: userId,
      sign_id: signId,
      metadata: uploadedToBucket,
    }, { transaction });

    console.log('videoCreated!!!!!! ---', videoCreated);
  }

  return transaction;
}

module.exports = {
  videoUpload,
};
