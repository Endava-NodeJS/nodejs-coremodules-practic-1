const multer = require("multer");
const upload = multer({ dest: "./temp/" });

exports.single = (inputFileName) => (req, res, next) => {
  upload.single(inputFileName)(req, res, (err) => {
    if (err) {
      console.log(err);
      if (err.code === "LIMIT_UNEXPECTED_FILE") {
        return res.status(400).send("Only one image should be received");
      }
      return res.status(500).send("Unable to process image");
    }
    next();
  });
};
