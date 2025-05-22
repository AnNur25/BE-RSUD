const aduanService = require("../services/aduan-service");
const responseHelper = require("../helpers/response");

class AduanController {
  static async createAduan(req, res) {
    try {
      const { nama, message, no_wa } = req.body;
      const data = await aduanService.createAduan({ nama, message, no_wa });
      responseHelper.created(res, data, "Aduan berhasil dibuat.");
    } catch (error) {
      responseHelper.error(res, error);
    }
  }

  static async getAllAduan(req, res) {
    try {
      const data = await aduanService.getAllAduan();
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
