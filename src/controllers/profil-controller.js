const profilService = require("../services/profil-service");
const responseHelper = require("../helpers/response-helper");

class ProfilController {
  static async getProfile(req, res) {
    const user = req.user;

    try {
      const result = await profilService.getProfile(user);
      return responseHelper.success(res, result, "Profile berhasil diambil");
    } catch (error) {
      return responseHelper.error(res, error);
    }
  }

  static async updateProfil(req, res) {
    try {
      const user = req.user;
      const { nama, email, no_wa } = req.body;
      const data = await profilService.updateProfil({
        nama,
        email,
        no_wa,
        user,
      });
      return responseHelper.success(res, data, "berhasil update profil");
    } catch (error) {
      return responseHelper.error(res, error);
    }
  }
  static async updatePassw(req, res) {
    const user = req.user;
    const { oldPassword, newPassword } = req.body;

    try {
      const result = await profilService.updatePassw(user, {
        oldPassword,
        newPassword,
      });
      return responseHelper.success(res, result, "Password berhasil diubah");
    } catch (error) {
      return responseHelper.error(res, error);
    }
  }

  static async forgetPassword(req, res) {
    const { email } = req.body;

    try {
      const result = await profilService.forgetPassword({ email });
      return responseHelper.success(
        res,
        result,
        "Link reset password telah dikirim ke email"
      );
    } catch (error) {
      return responseHelper.error(res, error);
    }
  }

  static async resetPassword(req, res) {
    const token = req.query.token;
    const { newPassw, confirmPassw } = req.body;

    try {
      const result = await profilService.resetPassword(token, {
        newPassw,
        confirmPassw,
      });
      return responseHelper.success(res, result, "Password berhasil diubah");
    } catch (error) {
      return responseHelper.error(res, error);
    }
  }
}

module.exports = ProfilController;
