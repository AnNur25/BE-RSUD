const responseHelper = require("../utils/response");
const authService = require("../services/auth-service");
const passport = require("passport");

class AuthController {
  static async registerAdmin(req, res) {
    try {
      const { nama, email, password } = req.body;
      const result = await authService.registerAdmin({ nama, email, password });
      return responseHelper.created(
        res,
        result,
        "Akun Admin berhasil registrasi"
      );
    } catch (error) {
      return responseHelper.error(res, error);
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;
      const result = await authService.login({ email, password });
      return responseHelper.success(res, result, "Login Success");
    } catch (error) {
      return responseHelper.error(res, error);
    }
  }

  static async logout(req, res) {
    try {
      await authService.logout(res);
      return responseHelper.success(res, null, "Berhasil logout");
    } catch (error) {
      return responseHelper.error(res, error);
    }
  }
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

module.exports = AuthController;
