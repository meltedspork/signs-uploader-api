const environments = {
  auth0: require('./auth0.client.config'),
  auth0Server: require('./auth0.server.config'),
  aws: require('./aws.config'),
  firebase: require('./firebase.client.config'),
  firebaseAdmin: require('./firebase.admin.config'),
  server: require('./server.config'),
  session: require('./session.config'),
};

console.log('environments:', environments);

module.exports = environments