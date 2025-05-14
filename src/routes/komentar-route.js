const express = require("express");
const route = express.Router();
const komentarController = require("../controllers/komentar-controller");
const { auth } = require("../middlewares/auth-middleware");


route.post("/:id_berita/komentar", komentarController.addKomentar);
// route.get("/:id/list-komentar", komentarController.listKomentar);
// // route.post("/:id/:id_komentar", auth, komentarController.replayKomentar);
// route.patch("/:id/:id_komentar", auth, komentarController.isVisibleKomentar);
// route.delete("/:id/:id_komentar", auth, komentarController.deleteKomentar);

module.exports = route;
