const multer = require("multer");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");

const uploadFile = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadFile)) {
  fs.mkdirSync(uploadFile);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadFile);
  },
  filename: function (req, file, cb) {
    const unikName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + unikName + ext);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ["image/jpeg", "image/png"];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Hanya gambar jpg/png yang diperbolehkan"), false);
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
