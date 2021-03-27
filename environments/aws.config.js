require('dotenv').config();

module.exports = {
  ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  REGION: process.env.AWS_REGION,
  S3_BUCKET_INPUT: process.env.AWS_S3_BUCKET_INPUT,
};
