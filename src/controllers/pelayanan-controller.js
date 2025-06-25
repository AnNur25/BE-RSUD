const pelayananService = require("../services/pelayanan-service");
const responseHelper = require("../helpers/response-helper");

class PelayananController {
  static async createPelayanan(req, res) {
    try {
      const { nama_pelayanan, Persyaratan, Prosedur, JangkaWaktu, Biaya } =
        req.body;
      const newPelayanan = await pelayananService.createPelayanan({
        nama_pelayanan,
        Persyaratan,
        Prosedur,
        JangkaWaktu,
        Biaya,
      });
      return responseHelper.success(
        res,
        newPelayanan,
        "Layanan berhasil ditambahkan",
        201
      );
    } catch (error) {
      return responseHelper.error(res, error);
    }
  }

  static async getPelayanan(req, res) {
    try {
      const data = await pelayananService.getPelayananList();
      return responseHelper.success(
        res,
        data,
        "Berhasil mendapatkan data pelayanan"
      );
    } catch (error) {
      return responseHelper.error(res, error);
    }
  }
  static async getById(req, res) {
    try {
      const { id_pelayanan } = req.params;
      const data = await pelayananService.getPelayananById(id_pelayanan);
      return responseHelper.success(res, data, "Data pelayanan ditemukan");
    } catch (error) {
      return responseHelper.error(res, error);
    }
  }

  static async updatePelayanan(req, res) {
    try {
      const { id_pelayanan } = req.params;
      const updated = await pelayananService.updatePelayanan(
        id_pelayanan,
        req.body
      );
      return responseHelper.success(
        res,
        updated,
        "Perubahan berhasil disimpan"
      );
    } catch (error) {
      return responseHelper.error(res, error);
    }
  }
}

module.exports = PelayananController;
