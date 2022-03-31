

const {
  getError,
  UNAUTHORIZED,
  FORBIDDEN,
} = require('../services/error.service');

const errorMiddleware = ((err, req, res, next) => {
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

module.exports = errorMiddleware;