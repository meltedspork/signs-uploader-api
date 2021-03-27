const { v4: uuidv4 } = require('uuid');
const AWS = require('aws-sdk');
const environment = require('../environments');

AWS.config.update({
  accessKeyId: environment.aws.ACCESS_KEY_ID,
  secretAccessKey: environment.SECRET_ACCESS_KEY,
  region: environment.aws.REGION,
});

const s3 = new AWS.S3();

const upload = async (file) => {
  const fileContent = Buffer.from(file.data, 'binary');
  const filename = `${uuidv4()}_${file.name}`;

  return await s3.upload({
    Bucket: environment.aws.S3_BUCKET_INPUT,
    Key: filename,
    Body: fileContent 
  }).promise();
}

module.exports = {
  upload,
};