const statusQueries = require('../../../../graphql/resolvers/queries/status');

describe('Status Queries', function () {
  test('viewStatus', async () => {
    const queryResult = await statusQueries.viewStatus();

    expect(queryResult).toEqual({
      alive: true,
    });
  });
});
