const express = require("express");
const Route = express.Router();
const spesialisController = require("../controllers/spesialisCoontroller");
const { auth } = require("../middleware/authMiddleware");

Route.post("/", auth, spesialisController.createSpesialis);
Route.get("/", spesialisController.getSpesialis);
Route.put("/:id", spesialisController.updateSpesialis);
Route.delete("/:id", spesialisController.deleteSpesialis);

module.exports = Route;
