const { Video } = require('../models');
const { uploadToBucketInput } = require('./aws-s3-sign');

const videoUpload = async (videoFile, transaction, userId, signId) => {
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
    const title = filename.split('.')[0];
    const videoFileStreamed = createReadStream();
    console.log('filed _______>', videoFileStreamed);

    const videoCreated = await Video.create({
      title,
      user_id: userId,
      sign_id: signId,
    }, { transaction });

    const fileNameUnique = _createUniquefileName(videoCreated, filename);
    const uploadedToBucket = await uploadToBucketInput(videoFileStreamed, fileNameUnique);
    console.log('uploadedToBucket _______>', uploadedToBucket);

    await videoCreated.update({
      metadata_mov: uploadedToBucket,
    }, { transaction });

    console.log('videoCreated.update _______>', videoCreated);
  }

  return transaction;
}

const _createUniquefileName = ({ uid }, filename) =>  `${uid}_${filename}`;

module.exports = {
  videoUpload,
};
