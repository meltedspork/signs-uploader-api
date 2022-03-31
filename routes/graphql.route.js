require('dotenv').config();

const { graphqlUploadExpress } = require('graphql-upload');
const { graphqlHTTP } = require('express-graphql');

// const checkJwtMiddleware = require('../middlewares/check-jwt.middleware');
const graphql = require('../graphql');
const { User } = require('../models');

const {
  getError,
  UNAUTHORIZED,
} = require('../services/error.service');
const logService = require('../services/log.service');

const express = require('express');
const router = express.Router();

const isProduction = process.env.NODE_ENV === 'production';

router.use(
  '/graphql',
  // checkJwtMiddleware,
  // jwtAuthz(['read:signs'], {failWithError: true, checkAllScopes: true}),
  graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 1 }),
  graphqlHTTP(async (req, res, graphQLParams) => {
    logService.warn('graphQLParams ---->>>>_____', graphQLParams);
    logService.warn('req.headers ---->>>>_____', req.headers);
    logService.warn('req.user ---->>>>_____', req.user);
    const {
      user,
      headers,
      session,
    } = req;
    logService.warn('User ---->>>>_____', User);
    logService.warn('User.findOne ---->>>>_____', User.findOne());
    const permissions = (user && user.permissions) ? user.permissions : [];
    const idProviderUserId = (user && user.sub) ? user.sub : (isProduction ? null : 'TestUser');

    let userFound = {};
    if (!isProduction && idProviderUserId !== 'TestUser') {
      userFound = await models.User.findOne({ where: { idProviderUserId } });
      if (!userFound || !userFound.idProviderUserId) {
        throw new Error(UNAUTHORIZED);
      }
    }
    return {
      schema: graphql,
      graphiql: !isProduction,
      context: {
        res,
        headers,
        user: userFound,
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
