const express = require("express");
const Route = express.Router();
const spesialisController = require("../controllers/spesialisCoontroller");
const { auth } = require("../middleware/authMiddleware");

Route.post("/", auth, spesialisController.createSpesialis);

module.exports = Route;
