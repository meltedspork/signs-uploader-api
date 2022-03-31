require('dotenv').config();

const express = require('express');
const cors = require('cors');

const expressSession = require('express-session');
const FirebaseStore = require('connect-session-firebase')(expressSession);

const checkJwtMiddleware = require('./middlewares/check-jwt.middleware');

// Auth0 deps
const jwtAuthz = require('express-jwt-authz');

const {
  getError,
  UNAUTHORIZED,
  FORBIDDEN,
} = require('./services/error.service');
const logService = require('./services/log.service');

const firebaseAdmin = require('./config/firebase-admin.config');
const firebase = require('./config/firebase.config');

const configRoute = require('./routes/config.route');
const statusRoute = require('./routes/status.route');
const graphqlRoute = require('./routes/graphql.route');
 
var app = express();
app.set('trust proxy', 'loopback');
app.use(cors({
  credentials: true,
  origin: process.env.ORIGINS.split(','),
  exposedHeaders: [
    'X-Pagination-Total',
    'X-Pagination-Page',
    'X-Pagination-Size',
  ],
}));
app.use(express.json({limit: '25mb'}));
app.use(express.urlencoded({limit: '25mb'}));

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

app.use(configRoute);

app.use(statusRoute);

app.use(checkJwtMiddleware);
app.use(graphqlRoute);


app.get('/test_jwt', /*jwtAuthz(['read:signs'], {failWithError: true, checkAllScopes: true}),*/ async (req, res) => {
  console.log('req.headers', req.headers);

  // const firebaseToken = await firebaseAdmin.auth().createCustomToken(req.user.sub);
  // req.session.firebaseToken = firebaseToken;

  // if (process.env.NODE_ENV === 'production') {
  //   res.send({ status: ok });
  // } else {
  //   res.send({ firebaseToken });
  // }
  res.send({ ok: 'ok' });
});

// const getData = async () => {
//   const snapshot = await firebase.firestore().collection('foobars').get();
//   return snapshot.docs.map(doc => doc.data());
// };

// app.get('/check', jwtAuthz(['read:signs'], {failWithError: true, checkAllScopes: true}), async (req, res) => {
//   console.log('--=================================');
//   console.log('--=================================');
//   console.log('--=================================');
//   console.log('--=================================');
//   console.log('--=================================');
//   console.log('--=================================');
//   console.log(req.user);
//   console.log(req.session);
//   console.log(req.session.firebaseToken);
//   console.log('||=================================');

//   let docs = [];
//   try {
//     await firebase.auth().signInWithCustomToken(req.session.firebaseToken);
//     console.log('signedIn:::');
//     docs = await getData();
//     await firebase.auth().signOut();
//     console.log('signedOut:::');
//   } catch (error) {
//     console.error('Something went wrong:', error);
//     docs = error;
//   }
  
//   res.send({
//     firebaseToken: req.session.firebaseToken,
//     docs,
//   });
// });

app.use((err, req, res, next) => {
  // logService.error('res', res);
  // logService.error('req', req);
  // logService.error('next', next);
  // logService.error('err', err);

  let errorType = null;
  if (err.name && err.name === 'UnauthorizedError') {
    errorType = UNAUTHORIZED;
  } else if (err.message && err.message === 'Insufficient scope') {
    errorType = FORBIDDEN;
  } else {
    return next(err, req, res);
  }
  const {
    statusCode: errorStatusCode,
    message: errorMessage,
  } = getError(errorType);
  return res.status(errorStatusCode).send({
    code: errorType,
    message: errorMessage,
  });
});

if (process.env.NODE_ENV === 'production') {
  app.listen(process.env.PORT, () => logService.info(`Running a GraphQL API server at ${process.env.PORT}`));
} else {
  const fs = require('fs');
  const https = require('https');
  const key = fs.readFileSync('localhost-key.pem', 'utf-8');
  const cert = fs.readFileSync('localhost.pem', 'utf-8');

  https.createServer({ key, cert }, app).listen(process.env.PORT, '0.0.0.0', () => {
    logService.info(`Running a GraphQL API server at HTTPS:${process.env.PORT}`);
  });
}
