const express = require("express");
const route = express.Router();
const oauthController = require("../controllers/oauth-controller");

route.get("/google", oauthController.googleLogin);
route.get("/google/callback", oauthController.googleCallback);

module.exports = route;
