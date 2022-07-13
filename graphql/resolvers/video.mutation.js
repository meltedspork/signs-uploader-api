const {
  Sign,
  Topic,
  Video,
} = require('../../models');
const { removeFromBucket } = require('../../services/aws-s3-sign');

const videoMutations = {
  async deleteVideo (_root, { uid, signUid }) {
    const video = await Video.findOne({
      where: {
        uid,
        '$sign.uid$': signUid,
      },
      include: {
        model: Sign,
        as: 'sign',
      },
    });

    try {
      const deletedVideoGIF = await removeFromBucket(video.metadata_gif);
      console.log('Deleted: deletedVideoGIF:', deletedVideoGIF);
    } catch (error) {
      console.log('gif error destroy:', error);
    }

    try {
      const deletedVideoMOV = await removeFromBucket(video.metadata_mov);
      console.log('Deleted: deletedVideoMOV:', deletedVideoMOV);
    } catch (error) {
      console.log('mov error destroy:', error);
    }

    try {
      const deletedVideoDB = await video.destroy();
      console.log('Deleted: deletedVideoDB:', deletedVideoDB);
    } catch (error) {
      console.log('db error destroy:', error);
    }

    const sign = await Sign.findOne({
      where: {
        uid: signUid,
      },
      include: [
        'topics',
        'videos',
        ],
      });
      const topics = await Topic.findAll();
      const signForm = {
        sign,
        topics,
      }

      console.log('signForm:', signForm);
      return signForm;
  },
};

module.exports = videoMutations;
