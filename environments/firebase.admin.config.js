require('dotenv').config();

module.exports = {
  /* START Firebase Client */
  DATABASE_URL: process.env.FIREBASE_CLIENT_DATABASE_URL,
  PROJECT_ID: process.env.FIREBASE_CLIENT_PROJECT_ID,
  /* END Firebase Client */
  TYPE: process.env.FIREBASE_ADMIN_TYPE,
  PRIVATE_KEY_ID: process.env.FIREBASE_ADMIN_PRIVATE_KEY_ID,
  PRIVATE_KEY: process.env.FIREBASE_ADMIN_PRIVATE_KEY,
  CLIENT_EMAIL: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
  CLIENT_ID: process.env.FIREBASE_ADMIN_CLIENT_ID,
  AUTH_URI: process.env.FIREBASE_ADMIN_AUTH_URI,
  TOKEN_URI: process.env.FIREBASE_ADMIN_TOKEN_URI,
  AUTH_PROVIDER_x509_CERT_URL: process.env.FIREBASE_ADMIN_AUTH_PROVIDER_x509_CERT_URL,
  CLIENT_x509_CERT_URL: process.env.FIREBASE_ADMIN_CLIENT_x509_CERT_URL,
};
