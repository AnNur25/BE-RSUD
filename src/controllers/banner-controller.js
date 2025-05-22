const responseHelper = require("../helpers/response-helper");
const bannerService = require("../services/banner-service");

class BannerController {
  static async createBanner(req, res) {
    try {
      const files = req.files;
      const banner = await bannerService.createBanner({ files });
      return responseHelper.created(res, banner, "Banner berhasil dibuat.");
    } catch (error) {
      responseHelper.error(res, error);
    }
  }
  static async getBanner(req, res) {
    try {
      const banner = await bannerService.getBanner();
      return responseHelper.success(
        res,
        banner,
        "Berhasil mendapatkan banner."
      );
    } catch (error) {
      responseHelper.error(res, error);
    }
  }
  static async deleteBanner(req, res) {
    try {
      const { ids } = req.body;
      const file = await bannerService.deleteBanner({ ids });
      return responseHelper.success(res, null, file.message);
    } catch (error) {
      responseHelper.error(res, error);
    }
  }
}

module.exports = BannerController;
