const response = require("../helpers/response-helper");
const mediaSosialServis = require("../services/media-sosoal-service");
const { BadRequestError, NotFoundError } = require("../utils/error-handling-utils");

class MediaSosialController {
  static async updateMediaSosial(req, res) {
    try {
      const { links } = req.body;

      if (!Array.isArray(links)) {
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
          throw new BadRequestError("link tidak valid");
        }
      }

      const data = await mediaSosialServis.updateLinks(links);

      return response.success(res, data, "berhasil memperbarui");
    } catch (error) {
      console.error(error);
      return response.error(res, error);
    }
  }
  static async getMediaSosial(req, res) {
    try {
      const data = await mediaSosialServis.getMediaSosial();
      return response.success(res, data, "berhasil menampilkan embed ig");
    } catch (error) {
      return response.error(res, error);
    }
  }
}

module.exports = MediaSosialController;
