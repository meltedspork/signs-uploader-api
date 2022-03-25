const request = require('supertest');
const express = require('express');

const elasticsearchConfig = require('../../config/elasticsearch.config');
const sequelizeConfig = require('../../config/sequelize.config');
const router = require('../../routes/status.route');

const app = new express();
app.use('/', router);

jest.mock('../../config/elasticsearch.config', () => ({
  esClient: {
    cluster: {
      health: async () => Promise.resolve({
        body: {
          status: 'green',
        },
        statusCode: 200,
      }),
    },
  }
})); 

jest.mock('../../config/sequelize.config', () => ({
  sequelize: {
    authenticate: async () => Promise.resolve(true),
  }
})); 

describe('/status', function () {
  test('when in good status', async () => {
    const res = await request(app).get('/status');

    expect(res.header['content-type']).toBe('application/json; charset=utf-8');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      env: process.env.NODE_ENV,
      database: {
        status: 'ok',
      },
      elasticsearch: {
        status: 'green',
        code: 200,
      }
    });
  });

  test('when in bad status', async () => {
    elasticsearchConfig.esClient = {
      cluster: {
        health: async () => Promise.reject('ELASTICSEARCH ERROR'),
      }
    }
    sequelizeConfig.sequelize = {
      authenticate: async () => Promise.reject('DATABASE ERROR'),
    }

    const res = await request(app).get('/status');

    expect(res.header['content-type']).toBe('application/json; charset=utf-8');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      env: process.env.NODE_ENV,
      database: {
        status: false,
        error: 'DATABASE ERROR',
      },
      elasticsearch: {
        status: false,
        error: 'ELASTICSEARCH ERROR',
      }
    });
  });
});
