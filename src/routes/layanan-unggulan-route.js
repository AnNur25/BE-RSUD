const route = require("express").Router();
const layananUnggulan = require("../controllers/layanan-unggulan-controller");
const multerErrorHandler = require("../middlewares/multer-error-handling-middleware");
const multer = require("../middlewares/multer-middleware");
const { auth } = require("../middlewares/auth-middleware");

route.post(
  "/",
  auth,
  multer.array("file"),
  multerErrorHandler,
  layananUnggulan.createLayananUnggulan
);

route.get("/", layananUnggulan.getAllLayananUnggulan);
route.put(
  "/:id",
  auth,
  multer.single("file"),
  multerErrorHandler,
  layananUnggulan.updateLayananUnggulan
);

route.put(
  "/:id",
  auth,
  multer.array("file"),
  multerErrorHandler,
  layananUnggulan.updateLayananUnggulan
);

module.exports = route;
