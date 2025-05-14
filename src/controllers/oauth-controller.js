const responseHelper = require("../utils/response");
const passport = require("passport");

class OauthController {
  static googleLogin(req, res, next) {
    const redirectTo = req.query.redirect;
    const state = Buffer.from(JSON.stringify({ redirectTo })).toString(
      "base64"
    );

    passport.authenticate("google", {
      scope: ["profile", "email"],
      state,
    })(req, res, next);
  }
  static googleCallback(req, res, next) {
    //tidak menyimpan login di session server-side
    passport.authenticate("google", { session: false }, (err, user, info) => {
      let redirectTo = req.query.redirect || "https://rsdbalung.vercel.app/";

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
        return res.redirect(`${redirectTo}?error=oauth_failed`);
      }

      return res.redirect(`${redirectTo}?token=${user.token}`);
    })(req, res, next);
  }
}

module.exports = OauthController;
