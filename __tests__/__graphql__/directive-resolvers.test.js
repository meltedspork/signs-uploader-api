const directiveResolvers = require('../../graphql/directive-resolvers');

const scopeObject = {
  scope: ['foo', 'bar'],
};
const nextFn = () => ({ next: true });

describe('directiveResolvers.hasScope', () => {
  test('with right permission', async () => {
    const permissionsObject = {
      permissions: ['foo', 'bar'],
    };

    await expect(
      await directiveResolvers.hasScope(nextFn, null, scopeObject, permissionsObject)
    ).toEqual({ next: true });
  });

  test('with wrong permission', async () => {
    const permissionsObject = {
      permissions: [],
    };

    await expect(
      directiveResolvers.hasScope(nextFn, null, scopeObject, permissionsObject)
    ).rejects.toThrow('FORBIDDEN');
  });
});
