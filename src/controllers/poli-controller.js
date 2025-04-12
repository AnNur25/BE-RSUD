const responseHelper = require("../utils/response");
const poliService = require("../services/poli-service");
const PoliService = require("../services/poli-service");
class PoliController {
  static async createPoli(req, res) {
    try {
      const { nama_poli } = req.body;

      const poli = await poliService.createPoli({ nama_poli });
      return responseHelper.created(res, poli, "Poli berhasil ditambahkan");
    } catch (error) {
      return responseHelper.error(res, error);
    }
  }

  static async getPoli(req, res) {
    try {
      const poli = await poliService.getPoli();
      return responseHelper.success(
        res,
        poli,
        "Berhasil menampilkan Daftar Poli"
      );
    } catch (error) {
      return responseHelper.error(res, error);
    }
  }
  static async getPoliById(req, res) {
    try {
      const id_poli = req.params.id;
      const poli = await PoliService.getPoliById({ id_poli });
      return responseHelper.success(res, poli, "Berhasil mengambil data poli");
    } catch (error) {
      return responseHelper.error(res, error);
    }
  }
  static async updatePoli(req, res) {
    try {
      const { id_poli } = req.params;
      const { nama_poli } = req.body;
      const poli = await PoliService.updatePoli({ id_poli }, { nama_poli });
      return responseHelper.success(res, poli, "perubahan berhasil disimpan");
    } catch (error) {
      return responseHelper.error(res, error);
    }
  }
}

module.exports = PoliController;
