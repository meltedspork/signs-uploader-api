require('dotenv').config();

const { graphqlUploadExpress } = require('graphql-upload');
const { graphqlHTTP } = require('express-graphql');

const checkJwtMiddleware = require('../middlewares/check-jwt.middleware');
const graphql = require('../graphql');
const models = require('../models');

const { getError } = require('../services/error.service');

const express = require('express');
const router = express.Router();

router.post(
  '/graphql',
  checkJwtMiddleware,
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
        session,
      } = req;
      console.log('req.idProviderUserId ---->>>>_____', idProviderUserId);
      const user = await models.User.findOne({ where: { idProviderUserId } });
      console.log('user ---->>>>_____', user);
      return {
        schema: graphql,
        graphiql: (process.env.NODE_ENV !== 'production'),
        context: {
          res,
          headers,
          models,
          user,
          permissions,
          session,
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

module.exports = router;
