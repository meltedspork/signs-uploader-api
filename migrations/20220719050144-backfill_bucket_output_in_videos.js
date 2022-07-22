'use strict';
const { S3_BUCKET_OUTPUT } = require('../config/aws.s3.config');
const { Video } = require('../models');

module.exports = {
  up: async () => {
    const videos = await Video.findAll({
      where: {
        bucket_output: null,
      },
    });
    videos.forEach(async (video) => {
      const videoUpdated = await video.update({
        bucket_output: S3_BUCKET_OUTPUT,
      });
      console.log('videoUpdated:', videoUpdated);
    });
    return videos;
  },
};
