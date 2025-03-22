const express = require("express");
const route = express.Router();
const hariSesiController = require("../controllers/hariSesiController");
const { auth } = require("../middlewares/authMiddleware");

//sesi
route.post("/sesi", auth, hariSesiController.createSesi);
route.get("/sesi", hariSesiController.getSesi);
route.put("/sesi/:id", auth, hariSesiController.updateSesi);
route.delete("/sesi/:id", auth, hariSesiController.deleteSesi);
//hari
route.post("/hari", auth, hariSesiController.createHari);
route.get("/hari", hariSesiController.getHari);
route.put("/hari/:id", auth, hariSesiController.updateHari);
route.delete("/hari/:id", auth, hariSesiController.deleteHari);
module.exports = route;
