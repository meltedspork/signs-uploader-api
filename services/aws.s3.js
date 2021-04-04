const { v4: uuidv4 } = require('uuid');
const { s3, S3_BUCKET_INPUT } = require('../config/aws.s3.config');

const upload = async (file) => {
  const fileContent = Buffer.from(file.data, 'binary');
  const filename = `${uuidv4()}_${file.name}`;

  return await s3.upload({
    Bucket: S3_BUCKET_INPUT,
    Key: filename,
    Body: fileContent 
  }).promise();
}

module.exports = {
  upload,
};