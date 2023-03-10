require('dotenv').config();

const express = require('express');
const router = express.Router();

router.patch('/video/status/:videoUid', async (req, res) => {
  console.log('/video/status/params', req.params);
  res.status(204).send();
});

module.exports = router;
