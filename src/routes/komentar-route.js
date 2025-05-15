const express = require("express");
const route = express.Router();
const komentarController = require("../controllers/komentar-controller");
const { auth } = require("../middlewares/auth-middleware");

route.post("/:id_berita/komentar", auth, komentarController.addKomentar);
route.get("/:id/komentar", komentarController.listKomentar);
route.get("/:id/komentar/visible", komentarController.listKomentarVisible);
route.patch(
  "/:id/komentar/:id_komentar",
  auth,
  komentarController.isVisibleKomentar
);
route.post(
  "/:id_berita/komentar/:id_komentar/replay",
  auth,
  komentarController.replayKomentar
);
// route.delete("/:id/:id_komentar", auth, komentarController.deleteKomentar);

module.exports = route;
