require('dotenv').config();

const express = require('express');
const cors = require('cors');

const expressSession = require('express-session');
const FirebaseStore = require('connect-session-firebase')(expressSession);

// Auth0 deps
const jwt = require('express-jwt');
const jwtAuthz = require('express-jwt-authz');
const jwksRsa = require('jwks-rsa');

const { esClient } = require('./config/elasticsearch.config');

// GraphQL
const { graphqlHTTP } = require('express-graphql');
const graphql = require('./graphql');
const { graphqlUploadExpress } = require('graphql-upload');
const unlessGraphqliAndIsNonProduction = require('./middlewares/unless-graphqli-and-is-non-production');
const {
  getError,
  UNAUTHORIZED,
  FORBIDDEN,
} = require('./utilities/error');

const { sequelize } = require('./config/sequelize.config');
const models = require('./models');

const firebaseAdmin = require('./config/firebase-admin.config');
const firebase = require('./config/firebase.config');
 
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
  server: 'Hello World!',
}));

app.get('/es', (_req, res) => {
  esClient.cluster.health({}, (err, resp, status) => {
    res.send({
      err,
      resp,
      status,
    });
  });
});

app.get('/config.json', (_req, res) => res.send({
  audience: process.env.AUTH0_CLIENT_AUDIENCE,
  client_id: process.env.AUTH0_CLIENT_CLIENT_ID,
  domain: process.env.AUTH0_CLIENT_DOMAIN,
  redirect_uri: process.env.AUTH0_CLIENT_REDIRECT_URI,
}));

if (process.env.NODE_ENV === 'production') {
  app.post(
    '/graphql',
    checkJwt,
    graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 1 }),
    graphqlHTTP(async (req, res, graphQLParams) => {
      console.log('graphQLParams ---->>>>_____', graphQLParams);
      const { user: { sub: idProviderUserId } } = req;
      const user = await models.User.findOne({ where: { idProviderUserId } });
      return {
        schema: graphql,
        graphiql: false,
        context: {
          models,
          user,
        },
        uploads: false,
      };
    }),
  );
} else {
  app.use(
    '/graphql',
    //unlessGraphqliAndIsNonProduction(checkJwt),
    checkJwt,
    // jwtAuthz(['read:signs'], {failWithError: true, checkAllScopes: true}),
    graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 1 }),
    graphqlHTTP(async (req, res, graphQLParams) => {
      console.log('graphQLParams ---->>>>_____', graphQLParams);
      console.log('req.headers ---->>>>_____', req.headers);
      console.log('req.user ---->>>>_____', req.user);
      console.log('req.user.sub ---->>>>_____', req.user.sub);
      console.log('req.user.permissions ---->>>>_____', req.user.permissions);
      const {
        user: {
          sub: idProviderUserId,
          permissions,
        },
        headers,
      } = req;
      console.log('req.idProviderUserId ---->>>>_____', idProviderUserId);
      const user = await models.User.findOne({ where: { idProviderUserId } });
      console.log('user ---->>>>_____', user);
      return {
        schema: graphql,
        graphiql: true,
        context: {
          res,
          headers,
          models,
          user,
          permissions,
        },
        uploads: false,
        customFormatErrorFn: (err) => {
          console.log('err', err);
          const {
            message,
            locations,
            path,
          } = err;
          const {
            statusCode: errorStatusCode,
            message: errorMessage,
          } = getError(message);
          return res.status(errorStatusCode).send({
            code: message,
            locations,
            path,
            message: errorMessage,
          });
        }
      };
    }),
  );
}

app.get('/test_db', async (_req, res) => {
  let authenticateObject = {
    env: process.env.NODE_ENV,
  };

  try {
    await sequelize.authenticate();
    Object.assign(authenticateObject, {
      connect: true,
    });
  } catch (error) {
    Object.assign(authenticateObject, {
      connect: false,
      error,
    });
  }

  res.send(authenticateObject);
});

app.use(checkJwt);

// app.get('/test_jwt', jwtAuthz(['read:signs'], {failWithError: true, checkAllScopes: true}), async (req, res) => {
//   const firebaseToken = await firebaseAdmin.auth().createCustomToken(req.user.sub);
//   req.session.firebaseToken = firebaseToken;

//   if (process.env.NODE_ENV === 'production') {
//     res.send({ status: ok });
//   } else {
//     res.send({ firebaseToken });
//   }
// });

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
  console.log('error: res', res);
  console.log('error: req', req);
  console.log('error: next', next);
  console.log('error: err', err);

  let erroType = null;
  if (err.name && err.name === 'UnauthorizedError') {
    erroType = UNAUTHORIZED;
  } else if (err.message && err.message === 'Insufficient scope') {
    erroType = FORBIDDEN;
  } else {
    return next(err, req, res);
  }
  const {
    statusCode: errorStatusCode,
    message: errorMessage,
  } = getError(erroType);
  return res.status(errorStatusCode).send({
    code: erroType,
    message: errorMessage,
  });
});

if (process.env.NODE_ENV === 'production') {
  app.listen(process.env.PORT, () => console.log(`Running a GraphQL API server at ${process.env.PORT}`));
} else {
  const fs = require('fs');
  const https = require('https');
  const key = fs.readFileSync('localhost-key.pem', 'utf-8');
  const cert = fs.readFileSync('localhost.pem', 'utf-8');

  https.createServer({ key, cert }, app).listen(process.env.PORT, '0.0.0.0', () => {
    console.log(`Running a GraphQL API server at HTTPS:${process.env.PORT}`);
  });
}
