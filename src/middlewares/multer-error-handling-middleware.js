const multer = require("multer");

const multerErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        statusCode: 400,
        status: "Failed",
        message: "Maksimal hanya 4 gambar yang diperbolehkan",
      });
    }
  } else if (err) {
    return res.status(500).json({
      statusCode: 500,
      status: "Failed",
      message: err.message,
    });
  }
  next();
};

module.exports = multerErrorHandler;
