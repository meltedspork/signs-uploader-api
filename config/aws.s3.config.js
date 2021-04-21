require('dotenv').config();
const AWS = require('aws-sdk');

const S3_BUCKET_INPUT = process.env.AWS_S3_BUCKET_INPUT;

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

module.exports = {
  S3_BUCKET_INPUT,
  s3,
};
