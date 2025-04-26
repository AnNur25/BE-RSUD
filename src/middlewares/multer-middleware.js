const multer = require("multer");

const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ["image/jpeg", "image/png"];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only images"), false);
  }
};

const multerCloud = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    files: 4,
    fileSize: 5 * 1024 * 1024,
  },
});

module.exports = multerCloud;
