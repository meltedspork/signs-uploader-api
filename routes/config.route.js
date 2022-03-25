require('dotenv').config();

const express = require('express');
const router = express.Router();

router.get('/config.json', (_req, res) => res.send({
  audience: process.env.AUTH0_CLIENT_AUDIENCE,
  client_id: process.env.AUTH0_CLIENT_CLIENT_ID,
  domain: process.env.AUTH0_CLIENT_DOMAIN,
  redirect_uri: process.env.AUTH0_CLIENT_REDIRECT_URI,
}));

module.exports = router;
