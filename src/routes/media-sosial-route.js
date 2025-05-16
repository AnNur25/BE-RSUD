const express = require("express");
const route = express.Router();
const mediaSosial = require("../controllers/media-sosial-controller");
const { auth } = require("../middlewares/auth-middleware");

route.get("/", mediaSosial.getMediaSosial);
route.put("/", auth, mediaSosial.updateMediaSosial);

module.exports = route;
