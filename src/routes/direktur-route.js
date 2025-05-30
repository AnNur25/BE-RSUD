const express = require("express");
const route = express.Router();
const direkturController = require("../controllers/direktur-controller");
const { auth, authorizeRole } = require("../middlewares/auth-middleware");
const multer = require("../middlewares/multer-middleware");
const multerErrorHandler = require("../middlewares/multer-error-handling-middleware");

route.post(
  "/direktur",
  auth,
  authorizeRole("ADMIN"),
  multer.single("gambar"),
  multerErrorHandler,
  direkturController.createDirektur
);

route.put(
  "/direktur/:id_direktur",
  auth,
  authorizeRole("ADMIN"),
  multer.single("gambar"),
  multerErrorHandler,
  direkturController.updateDirektur
);

route.get("/direktur", direkturController.getDirektur);

module.exports = route;
