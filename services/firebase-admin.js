const admin = require('firebase-admin');
const environment = require('../environments');

admin.initializeApp({
  credential: admin.credential.cert({
    type: environment.firebaseAdmin.TYPE,
    project_id: environment.firebaseAdmin.PROJECT_ID,
    private_key_id: environment.firebaseAdmin.PRIVATE_KEY_ID,
    private_key: environment.firebaseAdmin.PRIVATE_KEY,
    client_email: environment.firebaseAdmin.CLIENT_EMAIL,
    client_id: environment.firebaseAdmin.CLIENT_ID,
    auth_uri: environment.firebaseAdmin.AUTH_URI,
    token_uri: environment.firebaseAdmin.TOKEN_URI,
    auth_provider_x509_cert_url: environment.firebaseAdmin.AUTH_PROVIDER_x509_CERT_URL,
    client_x509_cert_url: environment.firebaseAdmin.CLIENT_x509_CERT_URL,
  }),
  databaseURL: environment.firebaseAdmin.DATABASE_URL,
});

module.exports = admin;
