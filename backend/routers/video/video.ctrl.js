const fs = require("fs-extra");
const path = require("path");

const uploadDir = path.join(__dirname, "../../", "uploads");

// This method will save the binary content of the request as a file.
const patch_binaryUpload = (req, res) => {
  //   console.log(req.body);
  //   req.pipe(fs.createWriteStream(`${uploadDir}/${Date.now()}.mp4`));
  res.send("success").end();
};

// This method will save a "photo" field from the request as a file.
const patch_multipartUpload = (req, res) => {
  // You can access other HTTP parameters. They are located in the body object.
  console.log(req.body);
  res.end("OK");
};

module.exports = {
  patch_binaryUpload,
  patch_multipartUpload,
};
