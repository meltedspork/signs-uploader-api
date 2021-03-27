require('dotenv').config();

module.exports = {
  AUDIENCE: process.env.AUTH0_CLIENT_AUDIENCE,
  DOMAIN: process.env.AUTH0_CLIENT_DOMAIN,
  CLIENT_ID: process.env.AUTH0_CLIENT_CLIENT_ID,
  REDIRECT_URI: process.env.AUTH0_CLIENT_REDIRECT_URI,
};
