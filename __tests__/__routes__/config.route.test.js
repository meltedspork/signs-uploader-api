const request = require('supertest');
const express = require('express');

const router = require('../../routes/config.route');

const app = new express();
app.use('/', router);

describe('GET /config.json', function () {
  test('responds with auth0 object', async () => {
    const res = await request(app).get('/config.json');

    expect(res.header['content-type']).toBe('application/json; charset=utf-8');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      audience: process.env.AUTH0_CLIENT_AUDIENCE,
      client_id: process.env.AUTH0_CLIENT_CLIENT_ID,
      domain: process.env.AUTH0_CLIENT_DOMAIN,
      redirect_uri: process.env.AUTH0_CLIENT_REDIRECT_URI,
    });
  });
});
