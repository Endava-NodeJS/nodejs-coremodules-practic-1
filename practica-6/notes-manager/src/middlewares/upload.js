const multer = require("multer");
const upload = multer({ dest: "./temp/" });

module.exports = (inputFileName) => upload.single(inputFileName);
