require('dotenv').config();

const express = require('express');
const router = express.Router();

const sequelizeConfig = require('../config/sequelize.config');
const elasticsearchConfig = require('../config/elasticsearch.config');
const checkJwtMiddleware = require('../middlewares/check-jwt.middleware');

if (process.env.NODE_ENV === 'production') {
  if (process.env.ENABLE_STATUS_IN_PRODUCTION !== 'true') {
    router.use(checkJwtMiddleware);
  }
}

const { s3, S3_BUCKET_OUTPUT } = require('../config/aws.s3.config');
const { signUrl } = require('../services/aws-s3-sign');

router.get('/status', async (_req, res) => {
  let authenticateObject = {
    env: process.env.NODE_ENV,
  };

  try {
    const { sequelize } = sequelizeConfig;
    await sequelize.authenticate();
    Object.assign(authenticateObject, {
      database: {
        status: 'ok',
      },
    });
  } catch (error) {
    Object.assign(authenticateObject, {
      database: {
        status: false,
        error,
      }
    });
  }

  try {
    const { esClient } = elasticsearchConfig;
    const {
      body: {
        status,
      },
      statusCode,
    } = await esClient.cluster.health();
    Object.assign(authenticateObject, {
      elasticsearch: {
        status,
        code: statusCode,
      },
    });
  } catch (error) {
    console.log('!!!! errorerrorerror', error);
    Object.assign(authenticateObject, {
      elasticsearch: {
        status: false,
        error,
      }
    });
  }

  res.send(authenticateObject);
});

router.get('/display', async (_req, res) => {
  try {
    const testCloudfrontFileKey = process.env.TEST_CLOUDFRONT_FILE_KEY;
    const obj = await s3.headObject({
      Bucket: S3_BUCKET_OUTPUT,
      Key: testCloudfrontFileKey,
    }).promise();

    console.log('---------obj');
    console.log('---------obj');
    console.log('---------obj');
    console.log('---------obj');
    console.log('---------obj');
    console.log('---------obj');
    console.log('---------obj');
    console.log('obj', obj);
    console.log(`Object "${obj}" exists`);

    res.send({
      url: signUrl(testCloudfrontFileKey),
      test_image: obj,
    });
  } catch (err) {
    let reason = null;
    if (err.statusCode === 403) {
      reason = `Bucket "${S3_BUCKET_OUTPUT}" Access Denied`;
    }
    if (err.statusCode >= 400 && err.statusCode < 500) {
      reason = `Bucket "${S3_BUCKET_OUTPUT}" Not Found`;
    }
    res.send({
      test_image: 'error',
      status_code: err.statusCode,
      reason: reason,
      raw: err,
    });
  }
});

module.exports = router;
