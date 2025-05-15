const response = require("../utils/response");
const mediaSosialServis = require("../services/media-sosial-service");

class MediaSosialController {
  static async updateMediaSosial(req, res) {
    try {
      const { links } = req.body;

      if (!Array.isArray(links) || links.length !== 4) {
        return response(
          res,
          400,
          false,
          null,
          "Harus mengirim 4 link Instagram"
        );
      }

      for (const link of links) {
        if (!link || !link.startsWith("https://www.instagram.com/")) {
          return response(res, 400, false, null, `Link tidak valid: ${link}`);
        }
      }

      // Panggil service update data
      await mediaSosialServis.updateLinks(links);

      return response(
        res,
        200,
        true,
        null,
        "Embed Instagram berhasil diperbarui"
      );
    } catch (error) {
      console.error(error);
      return response(res, 500, false, null, "Terjadi kesalahan pada server");
    }
  }
}

module.exports = MediaSosialController;
