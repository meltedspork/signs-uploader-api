const environment = require('./environments');

const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');

const expressSession = require('express-session');
const FirebaseStore = require('connect-session-firebase')(expressSession);

// Auth0 deps
const jwt = require('express-jwt');
const jwtAuthz = require('express-jwt-authz');
const jwksRsa = require('jwks-rsa');

// GraphQL
const graphql = require('./graphql');

const sequelize = require('./services/sequelize');
const firebaseAdmin = require('./services/firebase-admin');
const firebase = require('./services/firebase');

const signsRouter = require('./routes/signs');
 
var app = express();
app.set('trust proxy', 'loopback');
app.use(fileUpload());
app.use(cors({
  credentials: true,
  origin: environment.server.ORIGINS,
}));

app.use(expressSession({
  store: new FirebaseStore({
    database: firebaseAdmin.database(),
  }),
  name: environment.session.NAME,
  secret: environment.session.SECRET,
  resave: true,
  saveUninitialized: true,
  secure: true,
}));

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: environment.auth0Server.JWKS_URI,
  }),
  audience: environment.auth0Server.AUDIENCE,
  issuer: environment.auth0Server.ISSUER,
  algorithms: environment.auth0Server.ALGORITHMS,
});

app.get('/', (_req, res) => res.send({
  server: 'Hello World!'
}));

app.get('/config.json', (_req, res) => res.send({
  domain: environment.auth0.DOMAIN,
  client_id: environment.auth0.CLIENT_ID,
  audience: environment.auth0.AUDIENCE,
  redirect_uri: environment.auth0.REDIRECT_URI,
}));

// The GraphQL endpoint
graphql.applyMiddleware({ app });

app.get('/test_db', async (_req, res) => {
  try {
    await sequelize.authenticate();
    res.send({
      result: 'Connection has been established successfully.',
    });
  } catch (error) {
    res.send({
      result: 'Unable to connect to the database:',
      error
    });
  }
})

app.get('/test', checkJwt, jwtAuthz(['read:signs'], {failWithError: true, checkAllScopes: true}), async (req, res) => {
  const firebaseToken = await firebaseAdmin.auth().createCustomToken(req.user.sub);
  req.session.firebaseToken = firebaseToken;

  console.log(req.session)
  res.send({
    firebaseToken,
  });
});

const getData = async () => {
  const snapshot = await firebase.firestore().collection('foobars').get()
  return snapshot.docs.map(doc => doc.data());
}

app.get('/check', checkJwt, jwtAuthz(['read:signs'], {failWithError: true, checkAllScopes: true}), async (req, res) => {
  console.log('--=================================')
  console.log('--=================================')
  console.log('--=================================')
  console.log('--=================================')
  console.log('--=================================')
  console.log('--=================================')
  console.log(req.user)
  console.log(req.session)
  console.log(req.session.firebaseToken)
  console.log('||=================================')

  let docs = []
  try {
    const signedIn = await firebase.auth().signInWithCustomToken(req.session.firebaseToken);
    console.log('signedIn:::');
    docs = await getData();
    const signedOut = await firebase.auth().signOut();
    console.log('signedOut:::');
  } catch (error) {
    console.error('Something went wrong:', error);
    docs = error;
  }
  
  res.send({
    firebaseToken: req.session.firebaseToken,
    docs,
  });
});

app.use('/signs', checkJwt, jwtAuthz(['read:signs'], {failWithError: true, checkAllScopes: true}), signsRouter);

app.use((err, req, res, next) => {
  if (err.name && err.name === 'UnauthorizedError') {
    return res.status(401).send({error: 'Invalid token'});
  } else if (err.message && err.message === 'Insufficient scope') {
    return res.status(403).send({error: 'Insufficient permission'});
  }
  next(err, req, res);
});

if (!environment.server.PRODUCTION) {
  const fs = require('fs');
  const https = require('https');
  const key = fs.readFileSync('localhost-key.pem', 'utf-8');
  const cert = fs.readFileSync('localhost.pem', 'utf-8');

  https.createServer({ key, cert }, app).listen(environment.server.PORT, '0.0.0.0', () => {
    console.log(`Running a GraphQL API server at HTTPS:${environment.server.PORT}`)
  });
} else {
  app.listen(environment.server.PORT, () => console.log(`Running a GraphQL API server at ${environment.server.PORT}`));
}
