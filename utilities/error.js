const errorTypes = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
}

const allErrors = {
  UNAUTHORIZED: {
    message: 'Authentication required',
    statusCode: 401,
  },
  FORBIDDEN: {
    message: 'Access forbidden',
    statusCode: 403,
  },
}

const getError = errorName => {
  return allErrors[errorName];
}

module.exports = {
  ...errorTypes,
  getError,
};