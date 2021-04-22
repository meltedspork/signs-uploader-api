require('dotenv').config();
const AWS = require('aws-sdk');

const CLOUDFRONT_ACCESS_KEY_ID = process.env.AWS_CLOUDFRONT_ACCESS_KEY_ID;
const CLOUDFRONT_PRIVATE_KEY = process.env.AWS_CLOUDFRONT_PRIVATE_KEY.replace(/\\n/g, '\n');
const CLOUDFRONT_BASE_URL = process.env.AWS_CLOUDFRONT_BASE_URL;

const cloudFrontSigner = new AWS.CloudFront.Signer(
  CLOUDFRONT_ACCESS_KEY_ID,
  CLOUDFRONT_PRIVATE_KEY,
)

module.exports = {
  CLOUDFRONT_BASE_URL,
  cloudFrontSigner,
};
