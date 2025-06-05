const response = require("../helpers/response-helper");
const komentarService = require("../services/komentar-service");
const axios = require("axios");

class KomentarController {
  static async addKomentar(req, res) {
    try {
      const SECRET = process.env.RECAPTCHA_SECRET_KEY;

      console.log("REQ.PARAMS:", req.params);
      console.log("REQ.BODY:", req.body);
      console.log("REQ.USER:", req.user);

      const { id_berita } = req.params;
      const {
        nama: inputNama,
        no_wa: inputNoWa,
        isi_komentar,
        recaptcha_token,
      } = req.body;

      const user = req.user ?? null;

      const nama = inputNama ?? user?.nama ?? null;
      const no_wa = inputNoWa ?? user?.no_wa ?? null;

      if (!recaptcha_token) {
        return res
          .status(400)
          .json({ message: "reCAPTCHA token tidak ditemukan" });
      }

      console.log("Verifying reCAPTCHA...");

      const responseRecaptcha = await axios({
        url: `https://www.google.com/recaptcha/api/siteverify?secret=${SECRET}&response=${recaptcha_token}`,
        method: "POST",
      });

      const data = responseRecaptcha.data;
      console.log("RESPON reCAPTCHA:", data);

      if (!data.success) {
        return res.status(400).json({ message: "Verifikasi reCAPTCHA gagal" });
      }

      console.log("Data untuk komentarService:", {
        id_berita,
        nama,
        no_wa,
        isi_komentar,
        user,
      });

      const komentar = await komentarService.addKomentar({
        id_berita,
        nama,
        no_wa,
        isi_komentar,
        user,
      });

      return response.created(res, komentar, "Berhasil menambah komentar");
    } catch (error) {
      console.error("ERROR ADD KOMENTAR:", {
        message: error.message,
        stack: error.stack,
        ...(error.response && { response: error.response.data }),
      });
      return response.error(res, error);
    }
  }

  static async listKomentar(req, res) {
    try {
      const { id_berita } = req.params;
      const dataKomentar = await komentarService.listKomentar({ id_berita });
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
      const { id_berita } = req.params;
      const dataKomentar = await komentarService.listKomentarVisible({
        id_berita,
      });
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
      const { nama: inputNama, no_wa: inputNoWa, isi_komentar } = req.body;
      const user = req.user;

      console.log("DEBUG REPLAY KOMENTAR:", {
        id_berita,
        id_komentar,
        isi_komentar,
      });

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
        isi_komentar,
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
