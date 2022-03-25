const errorService = require('../../services/error.service');

describe('Error Service', function () {
  test('with FORBIDDEN', () => {
    const { FORBIDDEN } = errorService;

    const error = errorService.getError(FORBIDDEN);
    
    expect(error).toEqual({
      message: 'Access forbidden',
      statusCode: 403,
    });
  });

  test('when is UNAUTHORIZED', () => {
    const { UNAUTHORIZED } = errorService;

    const error = errorService.getError(UNAUTHORIZED);
    
    expect(error).toEqual({
      message: 'Authentication required',
      statusCode: 401,
    });
  });

  test('with unknown error', () => {
    const errorType = 'FATAL_UNKNOWN';

    const error = errorService.getError(errorType);
    
    expect(error).toEqual({
      message: errorType,
      statusCode: 500,
    });
  });
});
