// require("dotenv").config();
// const router = require("express").Router();
// const prisma = require("../prisma/prismaClient");
// const axios = require("axios");
// const bcrypt = require("bcryptjs");
// const passport = require("passport");
// const jwt = require("jsonwebtoken");
// router.get("/google", (req, res, next) => {
//   const redirectTo = req.query.redirect || "auth/login"; // default redirect
//   const state = Buffer.from(JSON.stringify({ redirectTo })).toString("base64");

//   passport.authenticate("google", {
//     scope: ["profile", "email"],
//     state,
//   })(req, res, next);
// });

// router.get("/login", (req, res) => {
//   res.send("Login with Google: <a href='/auth/google'>Login</a>");
// });
// router.get("/google/callback", (req, res, next) => {
//   passport.authenticate("google", { session: false }, (err, user, info) => {
//     let redirectTo = "login"; // default fallback

//     const state = req.query.state;
//     if (state) {
//       try {
//         const parsed = JSON.parse(
//           Buffer.from(state, "base64").toString("utf8")
//         );
//         if (parsed.redirectTo) {
//           redirectTo = parsed.redirectTo;
//         }
//       } catch (e) {
//         console.error("Failed to parse redirect state:", e);
//       }
//     }

//     // ❌ OAuth gagal
//     if (err || !user) {
//       return res.redirect(
//         `http://localhost:3000/${redirectTo}?error=oauth_failed`
//       );
//     }

//     // ✅ OAuth sukses, kirim token ke frontend (via query string)
//     return res.redirect(
//       `http://localhost:3000/${redirectTo}?token=${user.token}`
//     );
//   })(req, res, next);
// });

// router.post("/save-token", (req, res) => {
//   const authHeader = req.headers.authorization;
//   const token = authHeader && authHeader.split(" ")[1];

//   if (!token) {
//     return res.status(400).json({ message: "Token tidak ditemukan!" });
//   }

//   res.cookie("token", token, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "development",
//     sameSite: "None",
//     maxAge: 1 * 24 * 60 * 60 * 1000,
//   });

//   return res
//     .status(200)
//     .json({ message: "Token berhasil disimpan di cookie!" });
// });

// module.exports = router;
