require('dotenv').config();

module.exports = {
  /* START Auth0 Client */
  AUDIENCE: process.env.AUTH0_CLIENT_AUDIENCE,
  /* END Auth0 Client */
  ALGORITHMS: process.env.AUTH0_SERVER_ALGORITHMS.split(','),
  ISSUER: process.env.AUTH0_SERVER_ISSUER,
  JWKS_URI: process.env.AUTH0_SERVER_JWKS_URI,
};
