const BeritaService = require("../services/berita-service");
const responseHelper = require("../utils/response");
class Berita {
  static async createBerita(req, res) {
    try {
      const { judul, ringkasan, isi, tanggal_terbit } = req.body;
      const file = req.file;
      const berita = await BeritaService.createBerita(
        judul,
        ringkasan,
        isi,
        tanggal_terbit,
        file
      );
      return responseHelper.created(res, berita, "Berita berhasil dibuat");
    } catch (error) {
      return responseHelper.error(res, error);
    }
  }

  static async getBerita(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 10;
      const berita = await BeritaService.getBerita(page, pageSize);
      return responseHelper.success(res, berita, "Berhasil menampilkan berita");
    } catch (error) {
      return responseHelper.error(res, error);
    }
  }

  static async getBeritaById(req, res) {
    try {
      const { id_berita } = req.params;
      const berita = await BeritaService.getBeritaById(id_berita);
      return responseHelper.success(
        res,
        berita,
        "berhasil menampilkan detail berita"
      );
    } catch (error) {
      return responseHelper.error(res, error);
    }
  }

  static async updateBerita(req, res) {
    try {
      const { id_berita } = req.params;
      const { judul, ringkasan, isi, tanggal_terbit } = req.body;
      const file = req.file;
      const berita = await BeritaService.updateBerita(
        id_berita,
        judul,
        ringkasan,
        isi,
        tanggal_terbit,
        file
      );
      return responseHelper.success(res, berita, "Berita berhasil diperbarui");
    } catch (error) {
      return responseHelper.error(res, error);
    }
  }

  static async deleteBerita(req, res) {
    try {
      const { id_berita } = req.params;

      const berita = await BeritaService.deleteBerita(id_berita);
      return responseHelper.success(res, berita, "Berita berhasil dihapus");
    } catch (error) {
      return responseHelper.error(res, error);
    }
  }
}

module.exports = Berita;
