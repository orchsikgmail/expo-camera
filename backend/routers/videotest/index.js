const express = require('express');
const fs = require('fs-extra');
const path = require('path');
const multer = require('multer');
const router = express.Router();

// uploadDir
const uploadDir = path.join(__dirname, '../../', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('uploadDir:', uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const { fieldname, originalname, encoding, mimetype } = file;
    console.log('originalname:', originalname);
    cb(null, originalname);
  },
});

// upload
const upload = multer({ storage: storage }).single('file');

// router
router.post('/', (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      console.log(err);
      res.status(500).json(err);
    }
  });

  res.json({ success: true }).end();
});

module.exports = router;
