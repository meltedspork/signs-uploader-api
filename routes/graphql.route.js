require('dotenv').config();

const { graphqlUploadExpress } = require('graphql-upload');
const { graphqlHTTP } = require('express-graphql');
// const jwtAuthz = require('express-jwt-authz');

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
    let permissions = (user && user.permissions) ? user.permissions : [];
    let idProviderUserId = (user && user.sub) ? user.sub : null;
    logService.warn('idProviderUserId ---->>>>_____', idProviderUserId);
    let userFound = {};
    if (!isProduction && !idProviderUserId) {
      idProviderUserId = 'TestUser';
      permissions = ['read:signs', 'write:signs'];
    } else {
      userFound = await User.findOne({ where: { idProviderUserId } });
      logService.warn('userFound ---->>>>_____', userFound);
      logService.warn('!userFound ---->>>>_____', !userFound);
      logService.warn('!userFound.idProviderUserId ---->>>>_____', !userFound.idProviderUserId);
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
