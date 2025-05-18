const GoogleStrategy = require("passport-google-oauth20").Strategy;
const prisma = require("../prisma/prismaClient");
const passport = require("passport");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("Google Profile:", profile);
        const email = profile.emails[0].value;
        let user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              nama: profile.displayName,
              email,
              password: "",
              no_wa: "",
              role: "USER",
            },
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// 1. Ambil email dari akun Google
// 2. Cari user di database
// 3. Jika belum ada, buat user baru
// 4. Buat JWT token
// 5. Kirim token ke done()
