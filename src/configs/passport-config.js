// const GoogleStrategy = require("passport-google-oauth20").Strategy;
// const prisma = require("../prisma/prismaClient");
// const passport = require("passport");
// const jwt = require("jsonwebtoken");

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: "http://localhost:3000/auth/google/callback",
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         const email = profile.emails[0].value;
//         let user = await prisma.user.findUnique({
//           where: { email },
//         });

//         if (!user) {
//           user = await prisma.user.create({
//             data: {
//               nama: profile.displayName,
//               email,
//               password: "", // Kosongkan jika login Google
//             },
//           });
//         }

//         const token = jwt.sign(
//           { id_user: user.id_user },
//           process.env.JWT_SECRET,
//           { expiresIn: "1d" }
//         );

//         user.token = token;
//         return done(null, user);
//       } catch (err) {
//         return done(err, null);
//       }
//     }
//   )
// );
