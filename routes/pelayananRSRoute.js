const express = require("express");
const route = express.Router();
const pelayananRS = require("../controllers/pelayananRSController");
const {auth} = require("../middlewares/authMiddleware");

route.post("/", auth, pelayananRS.createPelayananRS);
route.get("/", pelayananRS.getPelayananRS);
route.put("/:id", auth, pelayananRS.updatePelayananRS);
route.delete("/:id", auth, pelayananRS.deletePelayananRS);
module.exports = route;
