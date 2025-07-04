const {
  BadRequestError,
  NotFoundError,
} = require("../utils/error-handling-utils");
const prisma = require("../prisma/prismaClient");
const { connect } = require("../routes/berita-route");
class komentarService {
  static async addKomentar({ slug, nama, no_wa, isi_komentar, user }) {
    if (!slug || !isi_komentar) {
      throw new BadRequestError("Field slug dan isi_komentar wajib diisi");
    }

    // Jika user tidak ada, nama dan no_wa wajib diisi
    if (!user && (!nama || !no_wa)) {
      throw new BadRequestError("Kolom tidak boleh kosong");
    }

    const komentar = await prisma.komentar.create({
      data: {
        nama,
        no_wa,
        isi_komentar,
        isVisible: true,
        berita: { connect: { slug } },
        ...(user && { user: { connect: { id_user: user.id_user } } }), // FK ke user
      },
    });

    return komentar;
  }

  static async listKomentar({ slug }) {
    if (!slug) {
      throw new BadRequestError(
        "slug berita diperlukan untuk mengambil komentar"
      );
    }
    const semuaKomentar = await prisma.komentar.findMany({
      where: {
        berita: {
          slug: slug,
        },
      },
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
        no_wa: komentar.no_wa,
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
          no_wa: balasan.no_wa,
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
              no_wa: balasan.no_wa,
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
      no_wa: k.no_wa ?? null,
      isVisible: k.isVisible ?? null,
      tanggal_komentar: k.tanggal_komentar ?? null,
      replies: k.replies || [],
    }));

    return hasil;
  }

  static async listKomentarVisible({ slug }) {
    const semuaKomentar = await prisma.komentar.findMany({
      where: {
        isVisible: true,
        berita: {
          slug: slug,
        },
      },
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
        no_wa: komentar.no_wa,
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
    slug,
    id_komentar,
    isi_komentar,
    id_user,
    nama,
    no_wa,
  }) {
    if (!slug || !id_komentar || !isi_komentar) {
      throw new BadRequestError(
        "slug, komentar ID, dan isi komentar wajib diisi"
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
      where: { slug },
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
        berita: {
          connect: {
            slug: slug,
          },
        },
        user: id_user
          ? {
              connect: { id_user },
            }
          : undefined,
        nama,
        no_wa,
        parent: {
          connect: { id_komentar: id_komentar },
        },
        isVisible: true,
      },
    });

    return balasan;
  }
}

module.exports = komentarService;
