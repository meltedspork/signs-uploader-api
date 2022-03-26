const checkJwtMiddleware = require('../../middlewares/check-jwt.middleware');

jest.mock('express-jwt', () => (jwt => jwt));
jest.mock('jwks-rsa', () => ({ expressJwtSecret: secret => secret }));

describe('Check Jwt Middleware', function () {
  test('with process.env', () => {    
    expect(checkJwtMiddleware).toEqual({
      algorithms: ['SHA256'],
      audience: 'http://localhost:4001/audience/',
      issuer: 'http://localhost:4001/issuer/',
      secret: {
        cache: true,
        jwksRequestsPerMinute: 5,
        jwksUri: 'http://localhost:4001/jwks.json',
        rateLimit: true,
      },
    });
  });
});
