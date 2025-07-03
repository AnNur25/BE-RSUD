const beritaService = require("../services/berita-service");
const responseHelper = require("../helpers/response-helper");
class Berita {
  static async createBerita(req, res) {
    try {
      const { judul, ringkasan, isi, tanggal_berita } = req.body;
      const file = req.file;
      const berita = await beritaService.createBerita({
        judul,
        ringkasan,
        isi,
        file,
        tanggal_berita
      });
      return responseHelper.created(res, berita, "Berita berhasil ditambahkan");
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

  static async getBeritaBySlug(req, res) {
    try {
      const { slug } = req.params;
      const berita = await beritaService.getBeritaBySlug({ slug });
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
      const { judul, ringkasan, isi, tanggal_berita } = req.body;
      const file = req.file;
      const berita = await beritaService.updateBerita({
        id,
        judul,
        ringkasan,
        isi,
        tanggal_berita,
        file,
      });
      return responseHelper.success(res, berita, "Perubahan berhasil disimpan");
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
      const files = req.files;
      const gambar = await beritaService.uploadGambar({ id, files });
      return responseHelper.created(res, gambar, "Foto berhasil ditambahkan");
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
        "Foto berhasil dihapus"
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
