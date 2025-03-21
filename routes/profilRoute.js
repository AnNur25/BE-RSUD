const express = require("express");
const router = express.Router();
const profilController = require("../controllers/profilController");

const { auth } = require("../middlewares/authMiddleware");

router.get("/profil", auth, profilController.getProfile);
router.put("/profil", auth, profilController.updatePassw);

module.exports = router;
