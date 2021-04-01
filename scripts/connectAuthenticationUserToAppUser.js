const { User } = require('../models');

const [
  email,
  idProviderUserId,
] = process.argv.splice(2);

(async () => {
  const user = await User.create({
    email,
    id_provider_user_id: idProviderUserId,
  });

  console.log('user.uid:', user.uid);
})();
