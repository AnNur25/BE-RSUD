const prisma = require("../prisma/prismaClient");
const {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
} = require("../utils/error");

class AduanService {
  static async createAduan({ nama, message, no_wa }) {
    if (!nama || !message || !no_wa) {
      throw new BadRequestError(
        "Semua field (nama, message, no_wa) harus diisi."
      );
    }

    const newaduan = await prisma.aduan.create({
      data: { nama, message, no_wa, is_visible: false },
    });

    return {
      id: newaduan.id_aduan,
      nama: newaduan.nama,
      message: newaduan.message,
      no_wa: newaduan.no_wa,
      is_visible: newaduan.is_visible,
      dibuat_pada: new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }).format(new Date(newaduan.createdAt)),
    };
  }

  static async getAllAduan() {
    const data = await prisma.aduan.findMany({
      include: { responAdmin: true },
      orderBy: { createdAt: "desc" },
    });
    return {
      data_aduan: data.map((aduan) => ({
        id: aduan.id_aduan,
        nama: aduan.nama,
        message: aduan.message,
        no_wa: aduan.no_wa,
        is_visible: aduan.is_visible,
        dibuat_pada: new Intl.DateTimeFormat("id-ID", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }).format(new Date(aduan.createdAt)),
        responAdmin: aduan.responAdmin.map((respon) => ({
          id: respon.id_respon_admin,
          message: respon.message,
          dibuat_pada: new Intl.DateTimeFormat("id-ID", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          }).format(new Date(respon.createdAt)),
        })),
      })),
    };
  }

  static async getAllVisibleAduan() {
    const data = await prisma.aduan.findMany({
      where: { is_visible: true },
      include: { responAdmin: true },
    });
    return {
      data_aduan: data.map((aduan) => ({
        id: aduan.id_aduan,
        nama: aduan.nama,
        message: aduan.message,
        no_wa: aduan.no_wa,
        is_visible: aduan.is_visible,
        dibuat_pada: new Intl.DateTimeFormat("id-ID", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }).format(new Date(aduan.createdAt)),
        responAdmin: aduan.responAdmin.map((respon) => ({
          id: respon.id_respon_admin,
          message: respon.message,
          dibuat_pada: new Intl.DateTimeFormat("id-ID", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          }).format(new Date(respon.createdAt)),
        })),
      })),
    };
  }

  static async aduanIsVisible({ id }) {
    if (!id) throw new BadRequestError("ID aduan harus disertakan.");

    const existing = await prisma.aduan.findUnique({ where: { id_aduan: id } });
    if (!existing) throw new NotFoundError("Aduan tidak ditemukan.");
    const newVisibility = existing.is_visible ? false : true;
    return await prisma.aduan.update({
      where: { id_aduan: id },
      data: { is_visible: newVisibility },
    });
  }

  // static async getAduanById(id) {
  //   if (!id) throw new BadRequestError("ID aduan harus disertakan.");

  //   const aduan = await prisma.aduan.findUnique({
  //     where: { id_aduan: id },
  //     include: { responAdmin: true },
  //   });

  //   if (!aduan) throw new NotFoundError("Aduan tidak ditemukan.");

  //   return aduan;
  // }

  // static async updateAduan(id, { judul, deskripsi, no_wa }) {
  //   if (!id) throw new BadRequestError("ID aduan harus disertakan.");
  //   if (!judul && !deskripsi && !no_wa) {
  //     throw new BadRequestError("Minimal satu field harus diperbarui.");
  //   }

  //   const existing = await prisma.aduan.findUnique({ where: { id_aduan: id } });
  //   if (!existing) throw new NotFoundError("Aduan tidak ditemukan.");

  //   return await prisma.aduan.update({
  //     where: { id_aduan: id },
  //     data: { judul, deskripsi, no_wa },
  //   });
  // }

  static async deleteAduan({ id }) {
    if (!id) throw new BadRequestError("ID aduan harus disertakan.");

    const existing = await prisma.aduan.findUnique({ where: { id_aduan: id } });
    if (!existing) throw new NotFoundError("Aduan tidak ditemukan.");

    return await prisma.aduan.delete({ where: { id_aduan: id } });
  }

  // static async markAsRead(id) {
  //   if (!id) throw new BadRequestError("ID aduan harus disertakan.");

  //   const aduan = await prisma.aduan.findUnique({ where: { id_aduan: id } });
  //   if (!aduan) throw new NotFoundError("Aduan tidak ditemukan.");
  //   if (aduan.is_read)
  //     throw new BadRequestError("Aduan sudah ditandai sebagai dibaca.");

  //   return await prisma.aduan.update({
  //     where: { id_aduan: id },
  //     data: { is_read: true },
  //   });
  // }

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

    return {
      id_respon_admin: response.id_respon_admin,
      message: response.message,
      id_user: response.id_user,
      id_aduan: response.id_aduan,
      dijawab_pada: new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }).format(new Date(response.createdAt)),
    };
  }
}

module.exports = AduanService;
