const firebase = require('firebase');
const environment = require('../environments');

require('firebase/auth');
require('firebase/database');

firebase.initializeApp({
  apiKey: environment.firebase.API_KEY,
  authDomain: environment.firebase.AUTH_DOMAIN,
  databaseURL: environment.firebase.DATABASE_URL,
  projectId: environment.firebase.PROJECT_ID,
  storageBucket: environment.firebase.STORAGE_BUCKET,
  messagingSenderId: environment.firebase.MESSAGING_SENDER_ID,
  appId: environment.firebase.APP_ID,
});

module.exports = firebase;
