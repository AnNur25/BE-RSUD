const galeriService = require("../services/galeriBeritaService");
const responseHelper = require("../utils/response");
class GambarTambahan {
  static async uploadGambar(req, res) {
    try {
      const { id } = req.params;
      const file = req.files;
      const gambar = await galeriService.uploadGambar(id, file);
      return responseHelper.created(res, gambar, "Gambar berhasil diunggah");
    } catch (error) {
      return responseHelper.error(res, error);
    }
  }

  static async getGambarByBerita(req, res) {
    try {
      const { id } = req.params;
      const gambarList = await galeriService.getGambarByBerita(id);
      return responseHelper.success(
        res,
        gambarList,
        "Berhasil menampilkan gambar"
      );
    } catch (error) {
      return responseHelper.error(res, error);
    }
  }

  static async deleteGambar(req, res) {
    try {
      const { ids } = req.body;

      const deleteGambar = await galeriService.deleteGambar(ids);

      return responseHelper.success(
        res,
        deleteGambar,
        "Gambar berhasil dihapus"
      );
    } catch (error) {
      return responseHelper.error(res, error);
    }
  }
}

module.exports = GambarTambahan;
