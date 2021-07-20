const { User } = require('../models');

const [
  nickname,
  email,
  idProviderUserId,
] = process.argv.splice(2);

(async () => {
  try {
    const user = await User.create({
      nickname,
      email,
      idProviderUserId, // might need to fix id_provider_user_id
    });

    console.log('user.uid:', user.uid);
  } catch (error) {
    console.log('error', error);
  }
})();
