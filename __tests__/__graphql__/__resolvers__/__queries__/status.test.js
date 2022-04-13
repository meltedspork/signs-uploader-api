const statusQueries = require('../../../../graphql/resolvers/status.query');

describe('Status Queries', function () {
  test('viewStatus', async () => {
    const queryResult = await statusQueries.viewStatus();

    expect(queryResult).toEqual({
      alive: true,
    });
  });
});
