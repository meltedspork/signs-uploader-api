const {
  DataTypes,
  Model,
} = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const { S3_BUCKET_OUTPUT } = require('../config/aws.s3.config');
const { signUrl } = require('../services/aws-s3-sign');

module.exports = (sequelize) => {
  class Video extends Model {
    static associate(models) {
      Video.belongsTo(models.Sign, {
        as: 'sign',
      });
    }
  }
  Video.init({
    uid: {
      allowNull: false,
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      unique: true,
    },
    title: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    bucket_output: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    user_id: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id',
        as: 'userId',
      }
    },
    sign_id: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: 'Signs',
        key: 'id',
        as: 'signId',
      }
    },
    metadata_gif: {
      allowNull: true,
      type: DataTypes.JSONB,
    },
    metadata_mov: {
      allowNull: true,
      type: DataTypes.JSONB,
    },
    src: {
      type: DataTypes.VIRTUAL,
      get() {
        // if (this.metadata_mov && this.metadata_mov.Key) {
          return signUrl(`${this.metadata_mov.Key.split('.')[0]}.gif`);
        // } else {}
        //   s3.headObject({
        //     Key: this.bucket_output || S3_BUCKET_OUTPUT,

        //   }, function (err, metadata) {  
        //     if (err && err.name === 'NotFound') {
        //       // Handle no object on cloud here
        //     } else if (err) {
        //       // Handle other errors here....
        //     } else {
        //       s3.getSignedUrl('getObject', params, callback);
        //       // Do stuff with signedUrl
        //     }
        //   });
        }
      },
    },
  }, {
    scopes: {
      serialize: {
        attributes: {
          exclude: [
            'id',
            'user_id',
            'sign_id',
            'signId',
            'SignId',
            'createdAt',
            'updatedAt',
          ],
        },
      },
    },
    sequelize,
    modelName: 'Video',
    tableName: 'Videos',
  });
  return Video;
};