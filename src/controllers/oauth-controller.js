const cookie = require("cookie-signature");
const { cookieSecure, cookieSecret } = require("../configs/env-config");
const JwtHelper = require("../utils/jwt-sign-utils");
const passport = require("passport");
const prisma = require("../prisma/prismaClient");
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
    passport.authenticate(
      "google",
      { session: false },
      async (err, user, info) => {
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
        await prisma.revokedToken.upsert({
          where: { user_id: String(user.id_user) },
          update: {
            token: refreshToken,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          },
          create: {
            user_id: String(user.id_user),
            token: refreshToken,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          },
        });
        res.cookie("aksesToken", cookie.sign(aksesToken, cookieSecret), {
          httpOnly: true,
          secure: cookieSecure,
          sameSite: cookieSecure ? "None" : "Lax",
          expires: new Date(Date.now() + 15 * 60 * 1000),
          path: "/",
        });

        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: cookieSecure,
          sameSite: cookieSecure ? "None" : "Lax", // Ubah ke None untuk cross-domain
          expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          path: "/",
        });

        res.redirect(
          `http://localhost:3000/api/v1/auth/testing?authSuccess=true?aksesToken=${aksesToken}&refreshToken=${refreshToken}`
        );
      }
    )(req, res, next);
  }
  static setCookie(req, res) {
    const { aksesToken, refreshToken } = req.body;

    if (!aksesToken || !refreshToken) {
      return res.status(400).json({ error: "Token tidak lengkap" });
    }

    res.cookie("aksesToken", cookie.sign(aksesToken, cookieSecret), {
      httpOnly: true,
      secure: cookieSecure,
      sameSite: cookieSecure ? "None" : "Lax",
      expires: new Date(Date.now() + 15 * 60 * 1000),
      path: "/",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: cookieSecure,
      sameSite: cookieSecure ? "None" : "Lax", // Ubah ke None untuk cross-domain
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      path: "/",
    });

    res.json({ success: true });
  }
}
module.exports = OauthController;
