// <<<<<<< komentar
// // // app.js atau index.js - File utama aplikasi Express
// // require("dotenv").config();
// // const express = require("express");
// // const sharp = require("sharp");
// // const router = express.Router();
// // const prisma = require("../prisma/prismaClient"); // sesuaikan path-nya
// // const imageKit = require("../configs/imagekit-config"); // sesuaikan path-nya
// // const { IgApiClient } = require("instagram-private-api");
// // const { get } = require("request-promise");
// // const multerConfig = require("../middlewares/multer-middleware");
// // const multerErrorHandler = require("../middlewares/multer-error-handling-middleware");
// =======
// //===percobaan postingan ig===

// // app.js atau index.js - File utama aplikasi Express
// require("dotenv").config();
// const express = require("express");
// const sharp = require("sharp");
// const router = express.Router();
// const prisma = require("../prisma/prismaClient");
// const imageKit = require("../configs/imagekit-config");
// const { IgApiClient } = require("instagram-private-api");
// const { get } = require("request-promise");
// const multerConfig = require("../middlewares/multer-middleware");
// const multerErrorHandler = require("../middlewares/multer-error-handling-middleware");
// >>>>>>> 2-development

// /**
//  * Function to post image to Instagram
//  * @param {string} imageUrl - URL of the image to post
//  * @param {string} caption - Caption for the Instagram post
//  * @returns {Promise<void>}
//  */
// const postToInstagram = async (imageUrl, caption) => {
//   try {
//     console.log("Logging in to Instagram...");
//     const ig = new IgApiClient();
//     ig.state.generateDevice(process.env.IG_USERNAME);
//     await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);
//     console.log("Logged in.");

//     console.log("Getting image buffer...");
//     const originalBuffer = await get({ url: imageUrl, encoding: null });

//     // Resize image to fit Instagram aspect ratio (1:1)
//     const resizedBuffer = await sharp(originalBuffer)
//       .resize(1080, 1080, { fit: "cover" }) // or use 1080x1350 for 4:5 ratio
//       .jpeg() // convert to jpeg if necessary
//       .toBuffer();

//     console.log("Posting image to Instagram...");
//     await ig.publish.photo({
//       file: resizedBuffer,
//       caption,
//     });

//     console.log("Successfully posted to Instagram");
//   } catch (error) {
//     console.error("Error posting to Instagram:", error);
//     throw new Error("Failed to post to Instagram");
//   }
// };
// router.post(
//   "/api/postingan",
//   multerConfig.single("image"),
//   async (req, res, next) => {
//     try {
//       // Extract data from request
//       const { caption } = req.body;
//       const post_to_instagram =
//         req.body.post_to_instagram === "true" ||
//         req.body.post_to_instagram === true;
//       const file = req.file;

//       if (!caption) {
//         return res.status(400).json({ error: "Caption is required" });
//       }

//       if (!file) {
//         return res.status(400).json({ error: "Image is required" });
//       }

//       // Upload image to ImageKit
//       let imageUrl = null;
//       if (file && file.buffer) {
//         const stringImage = file.buffer.toString("base64");
//         const uploadImage = await imageKit.upload({
//           fileName: file.originalname,
//           file: stringImage,
//         });
//         imageUrl = uploadImage?.url || null;
//       }

//       if (!imageUrl) {
//         return res.status(500).json({ error: "Failed to upload image" });
//       }

//       // Save to database
//       const post = await prisma.postingan.create({
//         data: {
//           caption,
//           image_url: imageUrl,
//           post_to_instagram,
//         },
//       });

//       // If post_to_instagram is true, post to Instagram
//       if (post_to_instagram) {
//         try {
//           await postToInstagram(imageUrl, caption);
//         } catch (instagramError) {
//           // Log error but don't fail the entire request
//           console.error("Instagram posting failed:", instagramError);
//           // Update post in database to reflect Instagram posting failure
//           await prisma.postingan.update({
//             where: { id: post.id },
//             data: { instagram_post_status: "FAILED" },
//           });

//           // Still send success but with warning
//           return res.status(201).json({
//             message: "Posting berhasil tetapi gagal diposting ke Instagram",
//             post,
//             instagram_error: instagramError.message,
//           });
//         }

//         // Update post in database to reflect Instagram posting success
//         await prisma.postingan.update({
//           where: { id: post.id },
//           data: { instagram_post_status: "SUCCESS" },
//         });
//       }

//       // Send success response
//       return res.status(201).json({
//         message: post_to_instagram
//           ? "Posting berhasil dan telah diposting ke Instagram"
//           : "Posting berhasil",
//         post,
//       });
//     } catch (error) {
//       console.error("Error creating post:", error);
//       return next(error);
//     }
//   }
// );

// module.exports = router;
