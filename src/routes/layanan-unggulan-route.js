const route = require("express").Router();
const bannerController = require("../controllers/banner-controller");
const multerErrorHandler = require("../middlewares/multer-error-handling-middleware");
const multer = require("../middlewares/multer-middleware");
const { auth } = require("../middlewares/auth-middleware");

route.post(
  "/",
  auth,
  multer.array("banner"),
  multerErrorHandler,
  bannerController.createBanner
);

route.get("/", bannerController.getBanner);

route.delete("/", auth, bannerController.deleteBanner);

module.exports = route;
