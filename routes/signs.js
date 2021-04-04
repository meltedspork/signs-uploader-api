const express = require('express');
const router = express.Router();
const { upload: s3Upload } = require('../services/aws.s3');

router.get('/', (req, res) => {
  res.send({
    foo: true,
  })
});

// file upload api
router.post('/upload', async (req, res) => {
  if (!req.files) {
      return res.status(500).send({ msg: "file is not found" })
  }

  console.log('req.files', req.files);
  const s3Uploaded = await s3Upload(req.files.file);

  return res.send({
    s3Uploaded,
  });
});

module.exports = router;