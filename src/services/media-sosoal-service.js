const prisma = require("../prisma/client"); // contoh prisma client

class MediaSosialServis {
  static async updateLinks(links) {
    const existingEmbeds = await prisma.iGEmbed.findMany({
      take: 4,
      orderBy: { id: "asc" },
    });

    if (existingEmbeds.length === 4) {
      for (let i = 0; i < 4; i++) {
        await prisma.iGEmbed.update({
          where: { id: existingEmbeds[i].id },
          data: { link: links[i] },
        });
      }
    } else {
      // Kalau belum lengkap, hapus semua dulu lalu insert ulang
      await prisma.iGEmbed.deleteMany({});
      for (const link of links) {
        await prisma.iGEmbed.create({ data: { link } });
      }
    }
  }
}

module.exports = MediaSosialServis;
