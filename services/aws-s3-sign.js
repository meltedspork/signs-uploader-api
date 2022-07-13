const {
  s3,
  S3_BUCKET_INPUT,
} = require('../config/aws.s3.config');
const { cloudFrontSigner, CLOUDFRONT_BASE_URL } = require('../config/aws.cloudfront.config');

const uploadToBucketInput = async (fileReadStream, fileName) => {
  return await s3.upload({
    Bucket: S3_BUCKET_INPUT,
    Key: fileName,
    Body: fileReadStream, 
  }).promise();
};

const removeFromBucket = async ({ Bucket, Key }) => {
  return await s3.deleteObject({ Bucket, Key }).promise();
};

const signUrl = (fileName) => {
  // 2 days as milliseconds to use for link expiration
  const twoDays = 2*24*60*60*1000;
  // Unix UTC timestamp for now + 2 days
  const expires = Math.floor((Date.now() + twoDays)/1000);

  // sign a CloudFront URL that expires 2 days from now
  return cloudFrontSigner.getSignedUrl({
    url: `${CLOUDFRONT_BASE_URL}/${fileName}`,
    expires,
  });
};

module.exports = {
  uploadToBucketInput,
  removeFromBucket,
  signUrl,
};
