require('dotenv').config();

module.exports = {
  API_KEY: process.env.FIREBASE_CLIENT_API_KEY,
  AUTH_DOMAIN: process.env.FIREBASE_CLIENT_AUTH_DOMAIN,
  DATABASE_URL: process.env.FIREBASE_CLIENT_DATABASE_URL,
  PROJECT_ID: process.env.FIREBASE_CLIENT_PROJECT_ID,
  STORAGE_BUCKET: process.env.FIREBASE_CLIENT_STORAGE_BUCKET,
  MESSAGING_SENDER_ID: process.env.FIREBASE_CLIENT_MESSAGING_SENDER_ID,
  APP_ID: process.env.FIREBASE_CLIENT_APP_ID,
};
