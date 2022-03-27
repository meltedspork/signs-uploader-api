require('dotenv').config();

const { graphqlUploadExpress } = require('graphql-upload');
const { graphqlHTTP } = require('express-graphql');

const checkJwtMiddleware = require('../middlewares/check-jwt.middleware');
const graphql = require('../graphql');
const models = require('../models');

const {
  getError,
  UNAUTHORIZED,
} = require('../services/error.service');
const logService = require('../services/log.service');

const express = require('express');
const router = express.Router();

router.post(
  '/graphql',
  checkJwtMiddleware,
  // jwtAuthz(['read:signs'], {failWithError: true, checkAllScopes: true}),
  graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 1 }),
  graphqlHTTP(async (req, res, graphQLParams) => {
    logService.warn('graphQLParams ---->>>>_____', graphQLParams);
    logService.warn('req.headers ---->>>>_____', req.headers);
    logService.warn('req.user ---->>>>_____', req.user);
    const {
      user: {
        sub: idProviderUserId,
        permissions,
      },
      headers,
      session,
    } = req;
    logService.warn('req.idProviderUserId ---->>>>_____', idProviderUserId);
    logService.warn('models ---->>>>_____', models);
    logService.warn('models.User ---->>>>_____', models.User);
    logService.warn('models.User.findOne ---->>>>_____', models.User.findOne());
    const user = await models.User.findOne({ where: { idProviderUserId } });
    logService.warn('user ---->>>>_____', user);
    if (!user || !user.idProviderUserId) {
      throw new Error(UNAUTHORIZED);
    }
    return {
      schema: graphql,
      graphiql: (process.env.NODE_ENV !== 'production'),
      context: {
        res,
        headers,
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
