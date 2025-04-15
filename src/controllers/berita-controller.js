const beritaService = require("../services/berita-service");
const responseHelper = require("../utils/response");
class Berita {
  static async createBerita(req, res) {
    try {
      const { judul, ringkasan, isi } = req.body;
      const file = req.file;
      const berita = await beritaService.createBerita(
        { judul, ringkasan, isi },
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
      const pageSize = parseInt(req.query.pageSize) || 9;
      const berita = await beritaService.getBerita(page, pageSize);
      return responseHelper.success(res, berita, "Berhasil menampilkan berita");
    } catch (error) {
      return responseHelper.error(res, error);
    }
  }

  static async getBeritaById(req, res) {
    try {
      const { id } = req.params;
      const berita = await beritaService.getBeritaById({ id });
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
      const { id } = req.params;
      const { judul, ringkasan, isi } = req.body;
      const file = req.file;
      const berita = await beritaService.updateBerita(
        { id },
        { judul, ringkasan, isi },
        file
      );
      return responseHelper.success(res, berita, "Berita berhasil diperbarui");
    } catch (error) {
      return responseHelper.error(res, error);
    }
  }

  static async deleteBerita(req, res) {
    try {
      const { id } = req.params;

      const berita = await beritaService.deleteBerita({ id });
      return responseHelper.success(res, null, "Berita berhasil dihapus");
    } catch (error) {
      return responseHelper.error(res, error);
    }
  }
  static async getGaleriBerita(req, res) {
    try {
      const { id } = req.params;
      const gambarList = await beritaService.getGambarByBerita({ id });
      return responseHelper.success(
        res,
        gambarList,
        "Berhasil menampilkan gambar"
      );
    } catch (error) {
      return responseHelper.error(res, error);
    }
  }
  static async uploadGambar(req, res) {
    try {
      const { id } = req.params;
      const file = req.files;
      const gambar = await beritaService.uploadGambar({ id }, file);
      return responseHelper.created(res, gambar, "Gambar berhasil diunggah");
    } catch (error) {
      return responseHelper.error(res, error);
    }
  }

  static async deleteGambar(req, res) {
    try {
      const beritaId = req.params.id;
      const { ids } = req.body;

      const deleteGambar = await beritaService.deleteGambar({ beritaId, ids });

      return responseHelper.success(
        res,
        deleteGambar,
        "Gambar berhasil dihapus"
      );
    } catch (error) {
      return responseHelper.error(res, error);
    }
  }
  berita;
  static async searchBerita(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 9;
      const { keyword } = req.query;
      const berita = await beritaService.searchBerita({
        page,
        pageSize,
        keyword,
      });
      return responseHelper.success(res, berita, "berhasil menampilkan berita");
    } catch (error) {
      return responseHelper.error(res, error);
    }
  }
}

module.exports = Berita;
