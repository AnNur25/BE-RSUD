const responseHelper = require("../helpers/response-helper");
const dokterService = require("../services/dokter-service");

class DokterController {
  static async createDokter(req, res) {
    try {
      const {
        nama,
        biodata_singkat,
        link_linkedin,
        link_instagram,
        link_facebook,
        id_poli,
      } = req.body;
      const file = req.file;
      const dokter = await dokterService.createDokter({
        nama,
        id_poli,
        biodata_singkat,
        link_linkedin,
        link_instagram,
        link_facebook,
        file,
      });
      return responseHelper.created(res, dokter, "Dokter berhasil ditambahkan");
    } catch (error) {
      return responseHelper.error(res, error);
    }
  }
  static async searchDokter(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 12;
      const { keyword } = req.query;
      const dokter = await dokterService.searchDokter({
        page,
        pageSize,
        keyword,
      });
      return responseHelper.success(res, dokter, "berhasil menampilkan dokter");
    } catch (error) {
      return responseHelper.error(res, error);
    }
  }
  static async getDokter(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 12;
      const dokter = await dokterService.getDokter(page, pageSize);
      return responseHelper.success(
        res,
        dokter,
        "Berhasil menampilkan daftar dokter"
      );
    } catch (error) {
      return responseHelper.error(res, error);
    }
  }
  static async getDokterById(req, res) {
    try {
      const { id_dokter } = req.params;
      const dokter = await dokterService.getDokterById(id_dokter);
      return responseHelper.success(
        res,
        dokter,
        "Berhasil mengambil data Dokter"
      );
    } catch (error) {
      return responseHelper.error(res, error);
    }
  }
  static async updateDokter(req, res) {
    try {
      const { id_dokter } = req.params;
      const {
        nama,
        biodata_singkat,
        link_linkedin,
        link_instagram,
        link_facebook,
        id_poli,
      } = req.body;
      const file = req.file;

      const updatedDokter = await dokterService.updateDokter({
        id_dokter,
        nama,
        biodata_singkat,
        link_linkedin,
        link_instagram,
        link_facebook,
        id_poli,
        file,
      });
      return responseHelper.success(
        res,
        updatedDokter,
        "Berhasil mengupdate Dokter"
      );
    } catch (error) {
      return responseHelper.error(res, error);
    }
  }

  static async deleteDokter(req, res) {
    try {
      const { id_dokter } = req.params;
      await dokterService.deleteDokter({ id_dokter });
      return responseHelper.success(res, null, "Berhasil hapus data Dokter");
    } catch (error) {
      return responseHelper.error(res, error);
    }
  }
}

module.exports = DokterController;
