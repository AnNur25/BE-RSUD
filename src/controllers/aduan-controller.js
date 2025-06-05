const aduanService = require("../services/aduan-service");
const responseHelper = require("../helpers/response-helper");
const axios = require("axios");

class AduanController {
  static async createAduan(req, res) {
    try {
      const SECRET = process.env.RECAPTCHA_SECRET_KEY;

      console.log("REQ.PARAMS:", req.params);
      console.log("REQ.BODY:", req.body);
      console.log("REQ.USER:", req.user);
      const { nama, message, no_wa, recaptcha_token } = req.body;
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

      console.log("Data untuk aduanService:", {
        nama,
        message,
        no_wa,
        recaptcha_token,
      });

      const addAduan = await aduanService.createAduan({ nama, message, no_wa });
      responseHelper.created(res, addAduan, "Aduan berhasil dibuat.");
    } catch (error) {
      responseHelper.error(res, error);
    }
  }

  static async getAllAduan(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 12;
      const data = await aduanService.getAllAduan({ page, pageSize });
      responseHelper.success(res, data, "Data aduan berhasil diambil.");
    } catch (error) {
      responseHelper.error(res, error);
    }
  }

  static async getAllVisibleAduan(req, res) {
    try {
      const data = await aduanService.getAllVisibleAduan();
      responseHelper.success(res, data, "Data aduan berhasil diambil.");
    } catch (error) {
      responseHelper.error(res, error);
    }
  }
  static async aduanIsVisible(req, res) {
    const { id } = req.params;
    try {
      const data = await aduanService.aduanIsVisible({ id });
      const message = data.is_visible
        ? "Aduan berhasil diaktifkan."
        : "Aduan berhasil dinonaktifkan.";
      responseHelper.success(res, data, message);
    } catch (error) {
      responseHelper.error(res, error);
    }
  }

  static async deleteAduan(req, res) {
    try {
      const { id } = req.params;
      await aduanService.deleteAduan({ id });
      responseHelper.success(res, null, "Aduan berhasil dihapus.");
    } catch (error) {
      responseHelper.error(res, error);
    }
  }

  static async replyAduan(req, res) {
    try {
      const { id } = req.params;
      const { message } = req.body;
      const id_user = req.user?.id_user;

      const data = await aduanService.replyAduan(id, id_user, message);
      responseHelper.created(res, data, "Respon berhasil dikirim.");
    } catch (error) {
      responseHelper.error(res, error);
    }
  }
}

module.exports = AduanController;
