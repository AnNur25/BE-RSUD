const prisma = require("../prisma/prismaClient");
const {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
} = require("../utils/error");

class AduanService {
  static async createAduan({ judul, deskripsi, no_wa }) {
    if (!judul || !deskripsi || !no_wa) {
      throw new BadRequestError(
        "Semua field (judul, deskripsi, no_wa) harus diisi."
      );
    }

    return await prisma.aduan.create({
      data: { judul, deskripsi, no_wa, is_read: false },
    });
  }

  static async getAllAduan() {
    return await prisma.aduan.findMany({
      include: { responAdmin: true },
    });
  }

  static async getAduanById(id) {
    if (!id) throw new BadRequestError("ID aduan harus disertakan.");

    const aduan = await prisma.aduan.findUnique({
      where: { id_aduan: id },
      include: { responAdmin: true },
    });

    if (!aduan) throw new NotFoundError("Aduan tidak ditemukan.");

    return aduan;
  }

  static async updateAduan(id, { judul, deskripsi, no_wa }) {
    if (!id) throw new BadRequestError("ID aduan harus disertakan.");
    if (!judul && !deskripsi && !no_wa) {
      throw new BadRequestError("Minimal satu field harus diperbarui.");
    }

    const existing = await prisma.aduan.findUnique({ where: { id_aduan: id } });
    if (!existing) throw new NotFoundError("Aduan tidak ditemukan.");

    return await prisma.aduan.update({
      where: { id_aduan: id },
      data: { judul, deskripsi, no_wa },
    });
  }

  static async deleteAduan(id) {
    if (!id) throw new BadRequestError("ID aduan harus disertakan.");

    const existing = await prisma.aduan.findUnique({ where: { id_aduan: id } });
    if (!existing) throw new NotFoundError("Aduan tidak ditemukan.");

    return await prisma.aduan.delete({ where: { id_aduan: id } });
  }

  static async markAsRead(id) {
    if (!id) throw new BadRequestError("ID aduan harus disertakan.");

    const aduan = await prisma.aduan.findUnique({ where: { id_aduan: id } });
    if (!aduan) throw new NotFoundError("Aduan tidak ditemukan.");
    if (aduan.is_read)
      throw new BadRequestError("Aduan sudah ditandai sebagai dibaca.");

    return await prisma.aduan.update({
      where: { id_aduan: id },
      data: { is_read: true },
    });
  }

  static async replyAduan(id, id_user, message) {
    if (!id) throw new BadRequestError("ID aduan harus disertakan.");
    if (!id_user)
      throw new ForbiddenError("Akses ditolak. User tidak terautentikasi.");
    if (!message || message.trim() === "") {
      throw new BadRequestError("Pesan tidak boleh kosong.");
    }

    const aduan = await prisma.aduan.findUnique({ where: { id_aduan: id } });
    if (!aduan) throw new NotFoundError("Aduan tidak ditemukan.");

    const response = await prisma.responAdmin.create({
      data: { message, id_user, id_aduan: id },
    });

    await prisma.aduan.update({
      where: { id_aduan: id },
      data: { is_read: true },
    });

    return response;
  }
}

module.exports = AduanService;
