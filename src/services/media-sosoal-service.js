const prisma = require("../prisma/prismaClient"); // contoh prisma client
const { BadRequestError, NotFoundError } = require("../utils/error");

class MediaSosialServis {
  static async updateLinks(links) {
    // Validasi: maksimal 4 link
    if (links.length > 4) {
      throw new BadRequestError("Maksimal 4 link yang diperbolehkan");
    }

    // Ambil semua embed yang ada, urutkan supaya update konsisten
    const existingEmbeds = await prisma.embedIg.findMany({
      orderBy: { createdAt: "asc" },
    });

    // Update atau tambahkan embed baru
    for (let i = 0; i < links.length; i++) {
      if (existingEmbeds[i]) {
        await prisma.embedIg.update({
          where: { id_embed: existingEmbeds[i].id_embed },
          data: { link_embed: links[i] },
        });
      } else {
        await prisma.embedIg.create({
          data: { link_embed: links[i] },
        });
      }
    }

    // Hapus embed yang tidak diperlukan (kelebihan dari 4 atau dari panjang links)
    if (existingEmbeds.length > links.length) {
      const embedsToDelete = existingEmbeds.slice(links.length);
      for (const embed of embedsToDelete) {
        await prisma.embedIg.delete({
          where: { id_embed: embed.id_embed },
        });
      }
    }
  }

  static async getMediaSosial() {
    const existingData = await prisma.embedIg.findMany();
    if (!existingData) {
      throw new NotFoundError("data tidak ada / kosong");
    }

    return existingData;
  }
}

module.exports = MediaSosialServis;
