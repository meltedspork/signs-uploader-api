const { FORBIDDEN } = require('../utilities/error');

const directiveResolvers = {
  async hasScope (next, _source, { scope }, { permissions }) {
    const success = permissions.every((permission) => scope.includes(permission))
    if (success) {
      return next();
    }
    throw new Error(FORBIDDEN);
  }
};

module.exports = directiveResolvers;