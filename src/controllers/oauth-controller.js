const cookie = require("cookie-signature");
const { cookieSecure, cookieSecret } = require("../configs/env-config");
const JwtHelper = require("../utils/jwt-sign");
const passport = require("passport");
class OauthController {
  static googleLogin(req, res, next) {
    const redirectTo = req.query.redirect || process.env.FRONTEND_URL;
    const state = Buffer.from(JSON.stringify({ redirectTo })).toString(
      "base64"
    );

    passport.authenticate("google", {
      scope: ["profile", "email"],
      state,
    })(req, res, next);
  }

  static googleCallback(req, res, next) {
    passport.authenticate("google", { session: false }, (err, user, info) => {
      // Default redirect to frontend URL jika tidak ada state
      let redirectTo = process.env.FRONTEND_URL;

      const state = req.query.state;
      if (state) {
        try {
          const parsed = JSON.parse(
            Buffer.from(state, "base64").toString("utf8")
          );
          if (parsed.redirectTo) {
            redirectTo = parsed.redirectTo;
          }
        } catch (e) {
          console.error("Failed to parse redirect state:", e);
        }
      }

      if (err || !user) {
        console.error("Authentication error:", err);
        return res.redirect(
          `${redirectTo}?error=oauth_failed&reason=${encodeURIComponent(
            err?.message || "Unknown error"
          )}`
        );
      }

      const aksesToken = JwtHelper.generateToken(user);
      const refreshToken = JwtHelper.generateRefresToken(user);

      res.cookie("aksesToken", cookie.sign(aksesToken, cookieSecret), {
        httpOnly: true,
        secure: cookieSecure,
        sameSite: "None", 
        expires: new Date(Date.now() + 15 * 60 * 1000),
        path: "/api/v1",
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: cookieSecure,
        sameSite: "None", // Ubah ke None untuk cross-domain
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        path: "/api/v1/auth",
      });

      return res.redirect(`${redirectTo}?authSuccess=true`);
    })(req, res, next);
  }
}
module.exports = OauthController;
