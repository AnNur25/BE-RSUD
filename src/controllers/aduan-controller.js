const aduanService = require("../services/aduan-service");
const responseHelper = require("../utils/response");

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
      responseHelper.success(res, data, "Aduan berhasil ditampilkan.");
    } catch (error) {
      responseHelper.error(res, error);
    }
  }

  // static async getAduanById(req, res) {
  //   try {
  //     const { id } = req.params;
  //     const data = await aduanService.getAduanById(id);
  //     responseHelper.success(res, data, "Data aduan berhasil ditemukan.");
  //   } catch (error) {
  //     responseHelper.error(res, error);
  //   }
  // }

  // static async updateAduan(req, res) {
  //   try {
  //     const { id } = req.params;
  //     const { judul, deskripsi, no_wa } = req.body;
  //     const data = await aduanService.updateAduan(id, {
  //       judul,
  //       deskripsi,
  //       no_wa,
  //     });
  //     responseHelper.success(res, data, "Aduan berhasil diperbarui.");
  //   } catch (error) {
  //     responseHelper.error(res, error);
  //   }
  // }

  static async deleteAduan(req, res) {
    try {
      const { id } = req.params;
      await aduanService.deleteAduan(id);
      responseHelper.success(res, null, "Aduan berhasil dihapus.");
    } catch (error) {
      responseHelper.error(res, error);
    }
  }

  // static async aduanIsRead(req, res) {
  //   try {
  //     const { id } = req.params;
  //     const data = await aduanService.markAsRead(id);
  //     responseHelper.success(res, data, "Aduan telah ditandai sebagai dibaca.");
  //   } catch (error) {
  //     responseHelper.error(res, error);
  //   }
  // }

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
