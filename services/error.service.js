const logService = require('./log.service');

const errorTypes = {
  FORBIDDEN: 'FORBIDDEN',
  UNAUTHORIZED: 'UNAUTHORIZED',
}

const allErrors = {
  FORBIDDEN: {
    message: 'Access forbidden',
    statusCode: 403,
  },
  UNAUTHORIZED: {
    message: 'Authentication required',
    statusCode: 401,
  },
}

const getError = errorName => {
  logService.error('getError: errorName', errorName);
  return allErrors[errorName] || {
    message: errorName,
    statusCode: 500,
  };
}

module.exports = {
  ...errorTypes,
  getError,
};
