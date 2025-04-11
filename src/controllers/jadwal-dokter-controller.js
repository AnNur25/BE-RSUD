const jadwalDokterService = require("../services/jadwal-dokter-service");
const responseHelper = require("../utils/response");

class JadwalDokterController {
  static async getDokterByPoli(req, res) {
    try {
      const { id_poli } = req.params;
      const dokter = await jadwalDokterService.getDokterByPoli({ id_poli });
      return responseHelper.success(
        res,
        dokter,
        "Berhasil menampilkan daftar dokter berdasarkan poli"
      );
    } catch (error) {
      return responseHelper.error(res, error);
    }
  }
  static async createJadwalDokter(req, res) {
    try {
      const { id_dokter, layananList } = req.body;
      const result = await jadwalDokterService.createJadwalDokter({
        id_dokter,
        layananList,
      });
      return responseHelper.success(
        res,
        result,
        "Jadwal dokter berhasil ditambahkan",
        201
      );
    } catch (error) {
      return responseHelper.error(res, error);
    }
  }

  static async searchJadwalDokter(req, res) {
    try {
      const { id_poli, tanggal } = req.query;

      const result = await jadwalDokterService.searchJadwalDokter({
        id_poli,
        tanggal,
      });

      return responseHelper.success(
        res,
        result,
        `Data jadwal dokter untuk hari ${result.hari} (${tanggal}) berhasil diambil.`
      );
    } catch (error) {
      return responseHelper.error(res, error);
    }
  }

  static async getAllJadwalDokter(req, res) {
    try {
      const data = await jadwalDokterService.getAllJadwalDokter();
      return responseHelper.success(
        res,
        data,
        "Berhasil menampilkan seluruh jadwal dokter"
      );
    } catch (error) {
      return responseHelper.error(res, error);
    }
  }

  static async updateJadwalDokter(req, res) {
    try {
      const { id_dokter } = req.params;
      const { layananList } = req.body;

      const result = await jadwalDokterService.updateJadwalDokter(
        { id_dokter },
        { layananList }
      );

      return responseHelper.success(
        res,
        result,
        "Jadwal dokter berhasil diperbarui"
      );
    } catch (error) {
      return responseHelper.error(res, error);
    }
  }

  static async deleteJadwalDokterByDokterId(req, res) {
    try {
      const { id_dokter } = req.params;
      const result = await jadwalDokterService.deleteJadwalByDokterId({
        id_dokter,
      });
      return responseHelper.success(
        res,
        result,
        `Jadwal ${result.namaDokter} berhasil dihapus`
      );
    } catch (error) {
      return responseHelper.error(res, error);
    }
  }
}

module.exports = JadwalDokterController;
