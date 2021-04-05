const signQueries = {
  async sign (_root, { uid } , /*{ models }*/ context) {
    const { models } = context;
    return models.Sign.findOne({ where: { uid }});
  },
  async allSigns (_root, _args, /*{ models }*/ context) {
    //console.log('context', context);
    const { models, user } = context;
    const { sub: idProviderUserId } = user;
    const foundUser = await models.User.findOne({
      where: {
        idProviderUserId
      },
    });

    console.log('USER!!!!>>>>>>>>>>>', foundUser);
    return models.Sign.findAll();
  },
}

module.exports = signQueries;
