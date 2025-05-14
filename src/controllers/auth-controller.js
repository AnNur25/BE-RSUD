const responseHelper = require("../utils/response");
const authService = require("../services/auth-service");

class AuthController {
  static async register(req, res) {
    try {
      const { nama, email, password, no_wa, role } = req.body;
      const result = await authService.register({
        nama,
        email,
        password,
        no_wa,
        role,
      });
      return responseHelper.created(
        res,
        result,
        "Akun Admin berhasil registrasi"
      );
    } catch (error) {
      return responseHelper.error(res, error);
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;
      const result = await authService.login({ email, password });
      return responseHelper.success(res, result, "Login Success");
    } catch (error) {
      return responseHelper.error(res, error);
    }
  }

  static async logout(req, res) {
    try {
      await authService.logout(res);
      return responseHelper.success(res, null, "Berhasil logout");
    } catch (error) {
      return responseHelper.error(res, error);
    }
  }
}

module.exports = AuthController;
