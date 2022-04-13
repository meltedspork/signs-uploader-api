const { Video } = require('../models');
const { uploadToBucket } = require('./aws-s3-sign');

const videoUpload = async (videoFile, transaction, userId, signId) => {
  // const videoFilePipedIn = await videoFile;
  // const {
  //   filename,
  //   createReadStream,
  // } = videoFilePipedIn || {};

  // if (filename && createReadStream) {
  //   console.log('filename _______>', filename);
  //   const videoFileStreamed = createReadStream();
  //   console.log('filed _______>', videoFileStreamed);

  //   const uploadedToBucket = await uploadToBucket(videoFileStreamed, filename);
  //   console.log('uploadedToBucket _______>', uploadedToBucket);

  //   const videoCreated = await Video.create({
  //     title,
  //     file_name: filename,
  //     user_id: userId, // user.id,
  //     sign_id: signId, // signCreated.id,
  //     metadata: uploadedToBucket,
  //   }, { transaction });

  //   console.log('videoCreated!!!!!! ---', videoCreated);
  // }

  const videoCreated = await Video.create({
    title: 'foobar',
    file_name: 'filename',
    user_id: 'userId', // user.id,
    sign_id: 'signId', // signCreated.id,
    metadata: 'uploadedToBucket',
  }, { transaction });
  console.log('videoCreated!!!!!! ---', videoCreated);

  return transaction;
}

module.exports = {
  videoUpload,
};
