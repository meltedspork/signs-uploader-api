require('dotenv').config();

const sequelizeConfig = require('../config/sequelize.config');
const elasticsearchConfig = require('../config/elasticsearch.config');

const express = require('express');
const router = express.Router();

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
