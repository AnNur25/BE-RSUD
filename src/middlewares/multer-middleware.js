const multer = require("multer");
const path = require("path"); //Menangani jalur file & ambil ekstensi
const fs = require("fs"); //cek dan buat folder unggahan

//===route folder uunggahan===
const uploadFile = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadFile)) {
  fs.mkdirSync(uploadFile);
}

//===config penyimpanan===
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

//===filter mime===
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg"];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Hanya gambar jpg/jpeg dan png yang diperbolehkan"), false);
  }
};

//===config multer dengan diskstorage,filter,limit===
const multerCloud = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    files: 4,
    fileSize: 5 * 1024 * 1024,
  },
});

module.exports = multerCloud;
