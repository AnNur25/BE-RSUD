const express = require("express");
const Route = express.Router();
const dokterController = require("../controllers/dokterController");
const multerConfig = require("../middlewares/multerConfig");
const { auth } = require("../middlewares/authMiddleware");
const multer = require("multer");

Route.post(
  "/",
  auth,
  multerConfig.single("gambar"),
  dokterController.createDokter
);

Route.get("/", auth, dokterController.getDokter);

Route.put("/:id", auth, dokterController.updateDokter);
Route.delete("/:id", auth, dokterController.deleteDokter);

module.exports = Route;
