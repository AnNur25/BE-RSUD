/*
==fitur==
create banner maksimal 5 gambar
delete bentuk array = lebih dari 1 gambar
*/
const responseHelper = require("../utils/response");

class BannerController {
  static async createBanner(req, res) {
    try {
      const { banner } = req.file;
      const file = await createBanner({ banner });
      return responseHelper.created(res, file, "Banner berhasil dibuat.");
    } catch (error) {
      responseHelper.error(res, error);
    }
  }
  static async getBanner(req, res) {
    try {
      const file = await getBanner();
      return responseHelper.ok(res, file, "Berhasil mendapatkan banner.");
    } catch (error) {
      responseHelper.error(res, error);
    }
  }
  static async deleteBanner(req, res) {
    try {
      const { id } = req.params;
      const file = await deleteBanner({ id });
      return responseHelper.ok(res, file, `Banner ${file} berhasil dihapus`);
    } catch (error) {
      responseHelper.error(res, error);
    }
  }
}
