require('dotenv').config();

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
const unlessGraphqliAndIsNonProduction = require('./middlewares/unless-graphqli-and-is-non-production');

const firebaseAdmin = require('./config/firebase-admin.config');
const firebase = require('./config/firebase.config');

const signsRouter = require('./routes/signs');
 
var app = express();
app.set('trust proxy', 'loopback');
app.use(fileUpload());
app.use(cors({
  credentials: true,
  origin: process.env.ORIGINS.split(','),
}));

app.use(expressSession({
  store: new FirebaseStore({
    database: firebaseAdmin.database(),
  }),
  name: process.env.SESSION_NAME,
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  secure: true,
}));

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: process.env.AUTH0_SERVER_JWKS_URI,
  }),
  audience: process.env.AUTH0_CLIENT_AUDIENCE,
  issuer: process.env.AUTH0_SERVER_ISSUER,
  algorithms: process.env.AUTH0_SERVER_ALGORITHMS.split(','),
});

app.get('/', (_req, res) => res.send({
  server: 'Hello World!'
}));

app.get('/config.json', (_req, res) => res.send({
  audience: process.env.AUTH0_CLIENT_AUDIENCE,
  client_id: process.env.AUTH0_CLIENT_CLIENT_ID,
  domain: process.env.AUTH0_CLIENT_DOMAIN,
  redirect_uri: process.env.AUTH0_CLIENT_REDIRECT_URI,
}));

app.use(unlessGraphqliAndIsNonProduction(checkJwt));
graphql.applyMiddleware({ app });

app.get('/test', jwtAuthz(['read:signs'], {failWithError: true, checkAllScopes: true}), async (req, res) => {
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

app.get('/check', jwtAuthz(['read:signs'], {failWithError: true, checkAllScopes: true}), async (req, res) => {
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

app.use('/signs', jwtAuthz(['read:signs'], {failWithError: true, checkAllScopes: true}), signsRouter);

app.use((err, req, res, next) => {
  if (err.name && err.name === 'UnauthorizedError') {
    return res.status(401).send({error: 'Invalid token'});
  } else if (err.message && err.message === 'Insufficient scope') {
    return res.status(403).send({error: 'Insufficient permission'});
  }
  next(err, req, res);
});

if (process.env.NODE_ENV !== 'production') {
  const fs = require('fs');
  const https = require('https');
  const key = fs.readFileSync('localhost-key.pem', 'utf-8');
  const cert = fs.readFileSync('localhost.pem', 'utf-8');

  https.createServer({ key, cert }, app).listen(process.env.PORT, '0.0.0.0', () => {
    console.log(`Running a GraphQL API server at HTTPS:${process.env.PORT}`)
  });
} else {
  app.listen(process.env.PORT, () => console.log(`Running a GraphQL API server at ${process.env.PORT}`));
}
