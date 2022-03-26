// const SequelizeMock = require('sequelize-mock');
const request = require('supertest');
const express = require('express');

const models = require('../../models');
const router = require('../../routes/graphql.route');

// const mockSequelize = new SequelizeMock();
const app = new express();
app.use('/', router);

jest.mock('../../models', () => ({
  User: {
    findOne: () => Promise.resolve({
      uid: 'uid',
      idProviderUserId: 'idProviderUserId',
      email: 'xyz@abc.com',
      nickname: 'nickname',
    }),
  },
}));

jest.mock('../../middlewares/check-jwt.middleware', () => {
  return async (req, _res, next) => {
    req.user = {
      sub: 'idProviderUserId',
      permissions: ['read:signs'],
    };
    next();
  };
});

jest.mock('../../config/elasticsearch.config', () => ({
  esClient: {},
})); 

let postData = {
  query: `query viewStatus{
    viewStatus {
      alive
    }
  }`,
  operationName: 'viewStatus',
};

describe('POST /graphql', () => {
  describe('query viewStatus', () => {
    test('when user have permission', async () => {
      const res = await request(app).post('/graphql').send(postData);

      expect(res.header['content-type']).toBe('application/json; charset=utf-8');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({
        data: {
          viewStatus: {
            alive: true,
          },
        },
      });
    });

    // describe('when user dont have permission', () => {
    //   test('get UNAUTHORIZED', async () => {
    //     models.User = {
    //       findOne: () => Promise.resolve({ idProviderUserId: null }),
    //     };
    //     const res = await request(app).post('/graphql').send(postData);

    //     expect(res.header['content-type']).toBe('application/json; charset=utf-8');
    //     expect(res.statusCode).toBe(500);
    //     expect(res.body).toEqual({
    //       code: 'UNAUTHORIZED',
    //       locations: '',
    //       message: 'Authentication required',
    //       path: '',
    //     });
    //   });
    // });
  });
});
