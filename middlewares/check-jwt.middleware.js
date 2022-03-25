require('dotenv').config();

const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: process.env.AUTH0_SERVER_JWKS_URI,
  }),
  audience: process.env.AUTH0_CLIENT_AUDIENCE,
  issuer: process.env.AUTH0_SERVER_ISSUER,
  algorithms: process.env.AUTH0_SERVER_ALGORITHMS.split(','),
});

module.exports = checkJwt;
