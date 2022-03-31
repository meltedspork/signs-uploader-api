require('dotenv').config();

const express = require('express');
const router = express.Router();

const sequelizeConfig = require('../config/sequelize.config');
const elasticsearchConfig = require('../config/elasticsearch.config');
const checkJwtMiddleware = require('../middlewares/check-jwt.middleware');

if (process.env.NODE_ENV === 'production') {
  router.use(checkJwtMiddleware);
}

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

module.exports = router;
