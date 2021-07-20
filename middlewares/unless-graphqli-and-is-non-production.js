const { User } = require('../models');

module.exports = (middleware) => {
  return async (req, res, next) => {
    const {
      headers: {
        authorization,
        referer,
      },
      method,
    } = req;
    const [authType, authToken] = (authorization || '').split(' ');

    if (method === 'GET' && !referer) {
      return next();

    } else if (method === 'POST' && authType === 'User') {
      const { idProviderUserId } = await User.findOne({
        where: {
          uid: authToken,
        },
      });

      req.user = { sub: idProviderUserId };
      return next();
    }

    return middleware(req, res, next);
  };
};
