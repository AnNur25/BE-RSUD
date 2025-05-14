const response = require("../utils/response");
const komentarService = require("../services/komentar-service");

class KomentarController {
  static async addKomentar(req, res) {
    try {
      const { id_berita } = req.params;
      const { nama, no_wa, isi_komentar } = req.body;
      const data = await komentarService.addKomentar({
        id_berita,
        nama,
        no_wa,
        isi_komentar,
      });
      return response.created(res, data, "berhasil memberikan komentar");
    } catch (error) {
      return response.error(res, error);
    }
  }
  //   static async listKomentar(req, res) {}
  //   static async isVisibleKomentar(req, res) {}
  //   static async deleteKomentar(req, res) {}
}

module.exports = KomentarController;
