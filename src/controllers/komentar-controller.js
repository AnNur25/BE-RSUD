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
  static async listKomentar(req, res) {
    try {
      const dataKomentar = await komentarService.listKomentar();
      return response.success(
        res,
        dataKomentar,
        "Berhasil menampilkan list komentar"
      );
    } catch (error) {
      return response.error(res, error);
    }
  }
  static async listKomentarVisible(req, res) {
    try {
      const dataKomentar = await komentarService.listKomentarVisible();
      return response.success(
        res,
        dataKomentar,
        "Berhasil menampilkan list komentar visible"
      );
    } catch (error) {
      return response.error(res, error);
    }
  }
  static async isVisibleKomentar(req, res) {
    try {
      const { id_komentar } = req.params;
      const data = await komentarService.isVisibleKomentar({ id_komentar });
      const message = data.isVisible
        ? "Komentar berhasil diaktifkan."
        : "Komentar berhasil dinonaktifkan.";
      return response.success(res, message);
    } catch (error) {
      return response.error(res, error);
    }
  }
  static async replayKomentar(req, res) {
    try {
      const { id_berita, id_komentar } = req.params;
      const { message, nama: inputNama, no_wa: inputNoWa } = req.body;
      const user = req.user;

      let nama = inputNama;
      let no_wa = inputNoWa;

      // Jika user login dan data tidak diberikan dalam body, gunakan data dari token
      if (user && (!nama || !no_wa)) {
        nama = nama || user.nama;
        no_wa = no_wa || user.no_wa;
      }

      const data = await komentarService.replayKomentar({
        id_berita,
        id_komentar,
        id_user: user?.id_user,
        isi_komentar: message,
        nama,
        no_wa,
      });

      return response.created(res, data, "Berhasil membalas komentar.");
    } catch (error) {
      return response.error(res, error);
    }
  }
}

module.exports = KomentarController;
