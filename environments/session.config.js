require('dotenv').config();

module.exports = {
  NAME: process.env.SESSION_NAME,
  SECRET: process.env.SESSION_SECRET,
};