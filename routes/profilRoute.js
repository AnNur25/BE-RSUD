const express = require("express");
const router = express.Router();
const profilController = require("../controllers/profilController");

const { auth } = require("../middlewares/authMiddleware");

router.get("/profil", auth, profilController.getProfile);
router.put("/profil", auth, profilController.updatePassw);
router.post("/profil", auth, profilController.forgetPassword);
router.post("/", profilController.resetPassword);

module.exports = router;
