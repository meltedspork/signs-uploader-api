require('dotenv').config();

const express = require('express');
const router = express.Router();

const checkJwtMiddleware = require('../middlewares/check-jwt.middleware');

if (process.env.NODE_ENV === 'production' && process.env.Z_ENABLE_STATUS_IN_PRODUCTION !== 'true') {
  router.use(checkJwtMiddleware);
}

const sequelizeConfig = require('../config/sequelize.config');
const elasticsearchConfig = require('../config/elasticsearch.config');
const firebaseAdmin = require('../config/firebase-admin.config');

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
        raw_error: error,
      }
    });
  }

  try {
    const firebaseToken = await firebaseAdmin.auth().createCustomToken(req.user.sub);
    Object.assign(authenticateObject, {
      firebase: {
        token: firebaseToken,
        database: await firebaseToken.database(),
      },
    });
  } catch (error) {
    console.log('!!!! errorerrorerror', error);
    Object.assign(authenticateObject, {
      firebase: {
        status: false,
        raw_error: error,
      }
    });
  }

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
        raw_error: error,
      }
    });
  }

  try {
    const testCloudfrontFileKey = process.env.TEST_CLOUDFRONT_FILE_KEY;
    const obj = await s3.headObject({
      Bucket: S3_BUCKET_OUTPUT,
      Key: testCloudfrontFileKey,
    }).promise();

    Object.assign(authenticateObject, {
      cloudfront: {
        status: true,
        url: signUrl(testCloudfrontFileKey),
        object: obj,
      },
    });
  } catch (error) {
    console.log('!!!! errorerrorerror', error);
    let reason = null;
    if (err.statusCode === 403) {
      reason = `Bucket "${S3_BUCKET_OUTPUT}" Access Denied`;
    }
    if (err.statusCode >= 400 && err.statusCode < 500) {
      reason = `Bucket "${S3_BUCKET_OUTPUT}" Not Found`;
    }
    Object.assign(authenticateObject, {
      cloudfront: {
        status: false,
        status_code: statusCode,
        reason,
        raw_error: error,
      }
    });
  }

  res.send(authenticateObject);
});

module.exports = router;
