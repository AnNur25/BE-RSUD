const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post("/register-admin", authController.registerAdmin); 
router.post("/login", authController.login);

module.exports = router;


// router.post("/register-pj", authController.registerPJ);
/*
app.get("/admin", auth, authorizeRole("admin"), (req, res) => {
  res.json({ message: "Halo Admin, Anda berhasil mengakses halaman ini" });
});

app.get("/user", auth, authorizeRole("user", "admin"), (req, res) => {
  res.json({ message: "Halo User, Anda berhasil mengakses halaman ini" });
});

*/