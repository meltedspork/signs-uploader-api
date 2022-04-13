const { Video } = require('../../models');
const snakeCase = require('lodash/snakeCase');

const videoMutations = {
  async deleteVideo (_root, { uid, signId }) {
    try {
      const deleted = await Video.destroy({
        where: {
          uid,
          signId,
        },
      });
      console.log('Yya deleted!!!', deleted);
    } catch (error) {
      console.log('errror destroy!!!', error);
    }

    const videos = Video.findAll({
      where: {
        sign_id: signId,
      }
    })

    console.log('---->>>>> videos', videos);
    return videos;
  },
};

module.exports = videoMutations;
