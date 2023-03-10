require('dotenv').config();

const jwtBearer = require('express-oauth2-jwt-bearer');

const checkJwtBearer = jwtBearer.auth({
  audience: process.env.AUTH0_SERVER_ISSUER,
  issuerBaseURL: process.env.AUTH0_SERVER_ISSUER,
});

module.exports = checkJwtBearer;
