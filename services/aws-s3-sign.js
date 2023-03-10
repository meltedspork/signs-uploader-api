const {
  s3,
  S3_BUCKET_INPUT,
  S3_BUCKET_OUTPUT,
} = require('../config/aws.s3.config');
const { cloudFrontSigner, CLOUDFRONT_BASE_URL } = require('../config/aws.cloudfront.config');

// const getFileFromBucketOutput = async (key) => {
//   console.log(`checking Bucket "${S3_BUCKET_OUTPUT}"`);
//   try {
//     return await s3.headObject({
//       Bucket: S3_BUCKET_OUTPUT,
//       Key: 
//     });
//     console.log(`Bucket "${bucket}" exists`);
//   } catch (err) {
//     if (err.statusCode === 403) {
//       console.log(`Bucket "${bucket}" Access Denied`);
//     }
//     if (err.statusCode >= 400 && err.statusCode < 500) {
//       console.log(`Bucket "${bucket}" Not Found`);
//     }
//     throw err
//   }
// }

const uploadToBucketInput = async (fileReadStream, fileName) => {
  try {
    const data = await s3.upload({
      Bucket: S3_BUCKET_INPUT,
      Key: fileName,
      Body: fileReadStream, 
    }).promise();
    console.log('uploadToBucketInput data:', data);
    return data;
    ;
  } catch (err) {
    console.log('uploadToBucketInput err:', err);
  }
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
