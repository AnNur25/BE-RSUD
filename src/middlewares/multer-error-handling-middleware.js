const multer = require("multer");

const multerErrorHandler = (err, req, res, next) => {
  // Error handler untuk multer.MulterError
  if (err instanceof multer.MulterError) {
    const errorMessages = {
      LIMIT_FILE_SIZE: "Ukuran file melebihi 5MB",
      LIMIT_FILE_COUNT: "Maksimal 4 gambar yang diperbolehkan diunggah",
      LIMIT_FIELD_KEY: "Nama field tidak valid",
      LIMIT_UNEXPECTED_FILE: "Format gambar harus berupa JPG/PNG",
      SINGLE_FILE_LIMIT: "Hanya satu gambar yang diizinkan untuk diupload",
    };

    return res.status(400).json({
      statusCode: 400,
      status: "Failed",
      message: errorMessages[err.code] || "Error upload file",
    });
  }
  else if (err) {
    return res.status(400).json({
      statusCode: 400,
      status: "Failed",
      message: err.message || "Terjadi kesalahan saat upload",
    });
  }
  next();
};

module.exports = multerErrorHandler;
