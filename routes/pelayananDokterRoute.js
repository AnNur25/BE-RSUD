const express = require("express");
const Route = express.Router();
const pelayananDokterController = require("../controllers/pelayananDokterController");
const { auth } = require("../middleware/authMiddleware");

Route.post("/", auth, pelayananDokterController.createPelayananDokter);
Route.get("/", auth, pelayananDokterController.getPelayananDokter);
Route.put("/:id", pelayananDokterController.updatePelayananDokter);
Route.delete("/:id", pelayananDokterController.deletePelayananDokter);


module.exports = Route;