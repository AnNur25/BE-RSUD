const multer = require("multer");

const multerErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    const errorMessages = {
      LIMIT_FILE_SIZE: "Ukuran file melebihi 5MB",
      LIMIT_FILE_COUNT: "Maksimal hanya 4 file yang dapat diupload",
      LIMIT_FIELD_KEY: "Nama field tidak valid",
      LIMIT_UNEXPECTED_FILE: "Tipe file tidak didukung",
    };

    return res.status(400).json({
      statusCode: 400,
      status: "Failed",
      message: errorMessages[err.code] || "Error upload file",
    });
  } else if (err) {
    return res.status(400).json({
      statusCode: 400,
      status: "Failed",
      message: errorMessages[err.code] || "Terjadi kesalahan saat upload",
    });
  }
  next();
};

module.exports = multerErrorHandler;
