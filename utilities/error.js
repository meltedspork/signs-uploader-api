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
  console.log('getError: errorName', errorName);
  return allErrors[errorName];
}

module.exports = {
  ...errorTypes,
  getError,
};