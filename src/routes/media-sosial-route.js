const express = require("express");
const route = express.Router();
const mediaSosial = require("../controllers/media-sosial-controller");
const { auth, authorizeRole } = require("../middlewares/auth-middleware");

route.get("/", mediaSosial.getMediaSosial);
route.put("/", auth, authorizeRole("ADMIN"), mediaSosial.updateMediaSosial);

module.exports = route;
