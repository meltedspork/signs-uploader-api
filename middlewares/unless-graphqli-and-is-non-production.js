const { User } = require('../models');

module.exports = (middleware) => {
  return async (req, res, next) => {
    const {
      headers: {
        authorization,
        host,
        referer,
      },
      method,
      path,
    } = req;
    const [authType, authToken] = (authorization || '').split(' ');
    const [_, referred] = (referer || '').split('://');
    console.log('referred:', referred);
    console.log('req.headers', req.headers);
    if (process.env.NODE_ENV !== 'production'
      && path === '/graphql'
      && host === process.env.HOST) {
      if (method === 'GET' && !referer) {
        return next();
      } else if (method === 'POST' && authType === 'User'
        && referred === `${process.env.HOST}/graphql`) {
        const { idProviderUserId } = await User.findOne({
          where: {
            uid: authToken,
          },
        });
        req.user = { sub: idProviderUserId };
        return next();
      }
    }
    return middleware(req, res, next);
  };
};