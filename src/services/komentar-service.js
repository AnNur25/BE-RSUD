const {
  BadRequestError,
  NotFoundError,
} = require("../utils/error-handling-utils");
const prisma = require("../prisma/prismaClient");
const { connect } = require("../routes/berita-route");
class komentarService {
  static async addKomentar({ id_berita, nama, no_wa, isi_komentar }) {
    if (!id_berita || !nama || !no_wa || !isi_komentar) {
      throw new BadRequestError("Semua field wajib di isi");
    }

    const dataKomentar = await prisma.komentar.create({
      data: {
        nama,
        no_wa,
        isVisible: true,
        isi_komentar,
        berita: { connect: { id_berita } },
      },
    });
    return dataKomentar;
  }

  static async listKomentar() {
    const semuaKomentar = await prisma.komentar.findMany({
      orderBy: { createdAt: "asc" },
    });

    if (!semuaKomentar || semuaKomentar.length === 0) {
      throw new NotFoundError("Belum ada komentar.");
    }

    const formatTanggal = (tanggal) =>
      new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }).format(new Date(tanggal));

    const komentarMap = {};
    const balasanSementara = [];

    semuaKomentar.forEach((komentar) => {
      const formattedKomentar = {
        id_komentar: komentar.id_komentar,
        nama: komentar.nama,
        isi_komentar: komentar.isi_komentar,
        isVisible: komentar.isVisible,
        tanggal_komentar: formatTanggal(komentar.createdAt),
      };

      if (!komentar.parentId) {
        // Komentar utama
        komentarMap[komentar.id_komentar] = {
          ...formattedKomentar,
          replies: [],
        };
      } else {
        // Komentar balasan
        balasanSementara.push({
          ...formattedKomentar,
          parentId: komentar.parentId,
        });
      }
    });

    // Pasangkan semua balasan dengan parent-nya
    balasanSementara.forEach((balasan) => {
      const parent = komentarMap[balasan.parentId];
      if (parent) {
        parent.replies.push({
          id_komentar: balasan.id_komentar,
          nama: balasan.nama,
          isi_komentar: balasan.isi_komentar,
          isVisible: balasan.isVisible,
          tanggal_komentar: balasan.tanggal_komentar,
        });
      } else {
        // Jika parent belum ada di komentarMap, inisialisasi agar tidak hilang
        komentarMap[balasan.parentId] = {
          replies: [
            {
              id_komentar: balasan.id_komentar,
              nama: balasan.nama,
              isi_komentar: balasan.isi_komentar,
              isVisible: balasan.isVisible,
              tanggal_komentar: balasan.tanggal_komentar,
            },
          ],
        };
      }
    });

    // Kembalikan semua parent komentar lengkap beserta replies-nya
    const hasil = Object.values(komentarMap).map((k) => ({
      id_komentar: k.id_komentar ?? null,
      nama: k.nama ?? null,
      isi_komentar: k.isi_komentar ?? null,
      isVisible: k.isVisible ?? null,
      tanggal_komentar: k.tanggal_komentar ?? null,
      replies: k.replies || [],
    }));

    return hasil;
  }

  static async listKomentarVisible() {
    const semuaKomentar = await prisma.komentar.findMany({
      where: { isVisible: true },
      id_berita: id_berita,
      orderBy: { createdAt: "asc" },
    });

    if (!semuaKomentar || semuaKomentar.length === 0) {
      throw new NotFoundError("Belum ada komentar.");
    }

    const formatTanggal = (tanggal) =>
      new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }).format(new Date(tanggal));

    const komentarMap = {};

    semuaKomentar.forEach((komentar) => {
      const formattedKomentar = {
        id_komentar: komentar.id_komentar,
        nama: komentar.nama,
        isi_komentar: komentar.isi_komentar,
        isVisible: komentar.isVisible,
        tanggal_komentar: formatTanggal(komentar.createdAt),
      };

      if (!komentar.parentId) {
        // Parent komentar
        komentarMap[komentar.id_komentar] = {
          ...formattedKomentar,
          replies: [],
        };
      } else {
        // Ini balasan, cari parent-nya
        if (komentarMap[komentar.parentId]) {
          komentarMap[komentar.parentId].replies.push(formattedKomentar);
        } else {
          // Jika parent belum muncul, inisialisasi dulu dengan replies
          komentarMap[komentar.parentId] = {
            replies: [formattedKomentar],
          };
        }
      }
    });

    // Ambil semua parent beserta replies-nya
    const hasil = Object.values(komentarMap).filter(
      (k) => k.nama && k.isi_komentar
    );

    return hasil;
  }

  static async isVisibleKomentar({ id_komentar }) {
    if (!id_komentar) {
      throw new BadRequestError("Id komentar di perlukan");
    }

    const existingKomentar = await prisma.komentar.findUnique({
      where: { id_komentar },
    });
    if (!existingKomentar) {
      throw new NotFoundError("Data komentar kosong nih");
    }

    const isVisibleKomentar = existingKomentar.isVisible ? false : true;

    return await prisma.komentar.update({
      where: { id_komentar },
      data: { isVisible: isVisibleKomentar },
    });
  }
  static async replayKomentar({
    id_berita,
    id_komentar,
    isi_komentar,
    id_user,
    nama,
    no_wa,
  }) {
    if (!id_berita || !id_komentar || !isi_komentar) {
      throw new BadRequestError(
        "Berita ID, komentar ID, dan isi komentar wajib diisi"
      );
    }

    // Validasi komentar induk
    const komentarInduk = await prisma.komentar.findUnique({
      where: { id_komentar },
    });

    if (!komentarInduk) {
      throw new NotFoundError("Komentar induk tidak ditemukan");
    }

    // Validasi berita
    const berita = await prisma.berita.findUnique({
      where: { id_berita },
    });

    if (!berita) {
      throw new NotFoundError("Berita tidak ditemukan");
    }

    // Pastikan nama dan no_wa tersedia
    if (!nama || !no_wa) {
      throw new BadRequestError(
        "Nama dan nomor WA diperlukan untuk membalas komentar"
      );
    }

    const balasan = await prisma.komentar.create({
      data: {
        isi_komentar,
        berita_id: id_berita,
        user_id: id_user || null,
        nama,
        no_wa,
        parentId: id_komentar,
        isVisible: true,
      },
    });

    return balasan;
  }
}

module.exports = komentarService;
