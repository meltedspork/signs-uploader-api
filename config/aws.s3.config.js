require('dotenv').config();
const AWS = require('aws-sdk');

const S3_BUCKET_INPUT = process.env.AWS_S3_BUCKET_INPUT;
const S3_BUCKET_OUTPUT = process.env.AWS_S3_BUCKET_OUTPUT;

const checkBucket = async (s3, bucket) => {
  console.log(`checking Bucket "${bucket}"`);
  try {
    await s3.headBucket({ Bucket: bucket });
    console.log(`Bucket "${bucket}" exists`);
  } catch (err) {
    if (err.statusCode === 403) {
      console.log(`Bucket "${bucket}" Access Denied`);
    }
    if (err.statusCode >= 400 && err.statusCode < 500) {
      console.log(`Bucket "${bucket}" Not Found`);
    }
    throw err
  }
}

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

let s3Options = {};

// if (process.env.NODE_ENV !== 'production') {
//   Object.assign(s3Options, {
//     endpoint: 'http://localstack:4566'//process.env.AWS_ENDPOINT,
//   });
// }

const s3 = new AWS.S3(s3Options);

// Call S3 to obtain a list of the objects in the bucket
s3.listBuckets((err, data) => {
  if (err) {
    console.log("S3 List Bucket: Error", err);
  } else {
    console.log("S3 List Bucket: Success", data);
  }
});

(async () => { console.log('testing1'); await checkBucket(s3, S3_BUCKET_INPUT); })();
(async () => { console.log('testing2'); await checkBucket(s3, S3_BUCKET_OUTPUT); })();

module.exports = {
  S3_BUCKET_INPUT,
  S3_BUCKET_OUTPUT,
  s3,
};
