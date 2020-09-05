const express = require("express");
const router = express.Router();

router.get("/'", (req, res) => {
  console.log(123);
  res.send("love").end();
});

module.exports = router;

// const fs = require("fs-extra");
// const path = require("path");
// const multer = require("multer");

// const ctrl = require("./video.ctrl");

// const uploadDir = path.join(__dirname, "../../", "uploads");
// if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
// const upload = multer({ dest: uploadDir });

// router.patch(
//   "/multipartUpload",
//   upload.single("file"),
//   ctrl.patch_multipartUpload
// );
