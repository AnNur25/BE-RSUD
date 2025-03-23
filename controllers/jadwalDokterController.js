const prisma = require("../prisma/prismaClient");

class JadwalDokterController {
  static async createJadwalDokter(req, res) {
    try {
      const { id_Sesi, id_Hari, id_dokter, id_jamkerja } = req.body;
      const id_user = parseInt(req.user.id_user);

      if (!id_Sesi || !id_Hari || !id_dokter || !id_jamkerja) {
        return res.status(400).json({
          statusCode: 400,
          status: "Failed",
          message: "Semua field wajib diisi.",
        });
      }
      const parsedData = {
        id_Sesi: parseInt(id_Sesi),
        id_Hari: parseInt(id_Hari),
        id_dokter: parseInt(id_dokter),
        id_jamkerja: parseInt(id_jamkerja),
        id_user,
      };
      const [sesi, hari, dokter, jamkerja, user] = await Promise.all([
        prisma.sesi.findUnique({ where: { id_Sesi: parsedData.id_Sesi } }),
        prisma.hari.findUnique({ where: { id_Hari: parsedData.id_Hari } }),
        prisma.dokter.findUnique({
          where: { id_dokter: parsedData.id_dokter },
        }),
        prisma.jamkerja.findUnique({
          where: { id_Jamkerja: parsedData.id_jamkerja },
        }),
        prisma.user.findUnique({ where: { id_user: parsedData.id_user } }),
      ]);

      if (!sesi)
        return res.status(404).json({
          statusCode: 404,
          status: "Failed",
          message: "ID Sesi tidak ditemukan.",
        });
      if (!hari)
        return res.status(404).json({
          statusCode: 404,
          status: "Failed",
          message: "ID Hari tidak ditemukan.",
        });
      if (!dokter)
        return res.status(404).json({
          statusCode: 404,
          status: "Failed",
          message: "ID Dokter tidak ditemukan.",
        });
      if (!jamkerja)
        return res.status(404).json({
          statusCode: 404,
          status: "Failed",
          message: "ID Jam Kerja tidak ditemukan.",
        });
      if (!user)
        return res.status(404).json({
          statusCode: 404,
          status: "Failed",
          message: "ID User tidak ditemukan.",
        });

      const newJadwal = await prisma.jadwalDokter.create({
        data: parsedData,
      });
      res.status(201).json({
        statusCode: 201,
        status: "Success",
        message: "Jadwal dokter berhasil ditambahkan.",
        data: newJadwal,
      });
    } catch (error) {
      res.status(500).json({
        statusCode: 500,
        status: "Failed",
        message: "Internal Server Error.",
        error: error.message,
      });
    }
  }

  static async getJadwalDokter(req, res) {
    try {
      const allJadwal = await prisma.jadwalDokter.findMany({
        include: {
          dokter: {
            select: {
              id_dokter: true,
              nama: true,
              kontak: true,
              gambar: true,
              spesialis: { select: { nama_spesialis: true } },
              pelayananDokter: { select: { nama_pelayanan: true } },
            },
          },
          Sesi: { select: { id_Sesi: true, sesi: true } },
          Hari: {
            select: { id_Hari: true, hari_mulai: true, hari_selesai: true },
          },
          jamkerja: {
            select: {
              id_Jamkerja: true,
              jam_mulai: true,
              jam_selesai: true,
            },
          },
          user: { select: { id_user: true, nama: true } },
        },
      });

      const formattedData = allJadwal.map((jadwal) => ({
        id_jadwal_dokter: jadwal.id_jadwal_dokter,
        dokter: {
          id: jadwal.dokter.id_dokter,
          nama: jadwal.dokter.nama,
          kontak: jadwal.dokter.kontak,
          gambar: jadwal.dokter.gambar,
          spesialis: jadwal.dokter.spesialis.nama,
          pelayanan: jadwal.dokter.pelayananDokter.nama,
        },
        sesi: {
          id: jadwal.Sesi.id_Sesi,
          nama: jadwal.Sesi.sesi,
        },
        hari: {
          id: jadwal.Hari.id_Hari,
          hari_mulai: jadwal.Hari.hari_mulai,
          hari_selesai: jadwal.Hari.hari_selesai,
        },
        jam_kerja: {
          id: jadwal.jamkerja.id_Jamkerja,
          jam_kerja: {
            id: jadwal.jamkerja.id_Jamkerja,
            jam_mulai: jadwal.jamkerja.jam_mulai,
            jam_selesai: jadwal.jamkerja.jam_selesai,
          },
        },
        dibuat_oleh: {
          id: jadwal.user.id_user,
          nama: jadwal.user.nama,
        },
      }));

      res.status(200).json({
        statusCode: 200,
        status: "Success",
        message: "Berhasil menampilkan semua jadwal dokter.",
        data: formattedData,
      });
    } catch (error) {
      res.status(500).json({
        statusCode: 500,
        status: "Failed",
        message: "Internal Server Error.",
        error: error.message,
      });
    }
  }

  static async searchJadwalDokter(req, res) {
    try {
      const {
        nama_dokter,
        sesi,
        jam_mulai,
        jam_selesai,
        hari_mulai,
        hari_selesai,
        spesialis,
      } = req.query;

      const whereClause = {};

      if (nama_dokter) {
        whereClause.dokter = {
          nama: {
            contains: nama_dokter,
            mode: "insensitive",
          },
        };
      }

      if (spesialis) {
        whereClause.dokter = {
          ...whereClause.dokter,
          spesialis: {
            nama_spesialis: {
              contains: spesialis,
              mode: "insensitive",
            },
          },
        };
      }

      if (sesi) {
        whereClause.Sesi = {
          sesi: {
            contains: sesi,
            mode: "insensitive",
          },
        };
      }

      if (hari_mulai) {
        whereClause.Hari = {
          hari_mulai: {
            contains: hari_mulai,
            mode: "insensitive",
          },
        };
      }

      if (hari_selesai) {
        whereClause.Hari = {
          ...whereClause.Hari,
          hari_selesai: {
            contains: hari_selesai,
            mode: "insensitive",
          },
        };
      }

      // Filter jam mulai dan jam selesai dengan membandingkan string "HH:mm"
      if (jam_mulai || jam_selesai) {
        whereClause.jamkerja = {};

        if (jam_mulai) {
          whereClause.jamkerja.jam_mulai = {
            gte: jam_mulai, // Mencari jam >= jam_mulai (string)
          };
        }

        if (jam_selesai) {
          whereClause.jamkerja.jam_selesai = {
            lte: jam_selesai, // Mencari jam <= jam_selesai (string)
          };
        }
      }

      const filteredJadwal = await prisma.jadwalDokter.findMany({
        where: whereClause,
        include: {
          dokter: {
            select: {
              id_dokter: true,
              nama: true,
              kontak: true,
              gambar: true,
              spesialis: { select: { nama_spesialis: true } },
              pelayananDokter: { select: { nama_pelayanan: true } },
            },
          },
          Sesi: { select: { id_Sesi: true, sesi: true } },
          Hari: {
            select: { id_Hari: true, hari_mulai: true, hari_selesai: true },
          },
          jamkerja: {
            select: {
              id_Jamkerja: true,
              jam_mulai: true,
              jam_selesai: true,
            },
          },
          user: { select: { id_user: true, nama: true } },
        },
      });

      const formattedData = filteredJadwal.map((jadwal) => ({
        id_jadwal_dokter: jadwal.id_jadwal_dokter,
        dokter: {
          id: jadwal.dokter.id_dokter,
          nama: jadwal.dokter.nama,
          kontak: jadwal.dokter.kontak,
          gambar: jadwal.dokter.gambar,
          spesialis: jadwal.dokter.spesialis.nama_spesialis,
          pelayanan: jadwal.dokter.pelayananDokter.nama_pelayanan,
        },
        sesi: {
          id: jadwal.Sesi.id_Sesi,
          nama: jadwal.Sesi.sesi,
        },
        hari: {
          id: jadwal.Hari.id_Hari,
          hari_mulai: jadwal.Hari.hari_mulai,
          hari_selesai: jadwal.Hari.hari_selesai,
        },
        jam_kerja: {
          id: jadwal.jamkerja.id_Jamkerja,
          jam_mulai: jadwal.jamkerja.jam_mulai, // Tidak perlu konversi
          jam_selesai: jadwal.jamkerja.jam_selesai, // Tidak perlu konversi
        },
        dibuat_oleh: {
          id: jadwal.user.id_user,
          nama: jadwal.user.nama,
        },
      }));

      res.status(200).json({
        statusCode: 200,
        status: "Success",
        message: "Berhasil menampilkan jadwal dokter berdasarkan filter.",
        data: formattedData,
      });
    } catch (error) {
      res.status(500).json({
        statusCode: 500,
        status: "Failed",
        message: "Internal Server Error.",
        error: error.message,
      });
    }
  }

  static async updateJadwalDokter(req, res) {
    try {
      const id = parseInt(req.params.id);
      const { id_Sesi, id_Hari, id_dokter, id_jamkerja } = req.body;
      const id_user = parseInt(req.user.id_user);

      if (isNaN(id)) {
        return res.status(400).json({
          statusCode: 400,
          status: "Failed",
          message: "ID tidak valid.",
        });
      }
      const parsedData = {
        id_Sesi: parseInt(id_Sesi),
        id_Hari: parseInt(id_Hari),
        id_dokter: parseInt(id_dokter),
        id_jamkerja: parseInt(id_jamkerja),
        id_user,
      };
      const [sesi, hari, dokter, jamkerja, user] = await Promise.all([
        prisma.sesi.findUnique({ where: { id_Sesi: parsedData.id_Sesi } }),
        prisma.hari.findUnique({ where: { id_Hari: parsedData.id_Hari } }),
        prisma.dokter.findUnique({
          where: { id_dokter: parsedData.id_dokter },
        }),
        prisma.jamkerja.findUnique({
          where: { id_Jamkerja: parsedData.id_jamkerja },
        }),
        prisma.user.findUnique({ where: { id_user: parsedData.id_user } }),
      ]);

      if (!sesi)
        return res.status(404).json({
          statusCode: 404,
          status: "Failed",
          message: "ID Sesi tidak ditemukan.",
        });
      if (!hari)
        return res.status(404).json({
          statusCode: 404,
          status: "Failed",
          message: "ID Hari tidak ditemukan.",
        });
      if (!dokter)
        return res.status(404).json({
          statusCode: 404,
          status: "Failed",
          message: "ID Dokter tidak ditemukan.",
        });
      if (!jamkerja)
        return res.status(404).json({
          statusCode: 404,
          status: "Failed",
          message: "ID Jam Kerja tidak ditemukan.",
        });
      if (!user)
        return res.status(404).json({
          statusCode: 404,
          status: "Failed",
          message: "ID User tidak ditemukan.",
        });
      const existingJadwal = await prisma.jadwalDokter.findUnique({
        where: { id_jadwal_dokter: id },
      });

      if (!existingJadwal) {
        return res.status(404).json({
          statusCode: 404,
          status: "Failed",
          message: `Jadwal dokter dengan ID ${id} tidak ditemukan.`,
        });
      }

      const updatedJadwal = await prisma.jadwalDokter.update({
        where: { id_jadwal_dokter: id },
        data: parsedData,
      });

      res.status(200).json({
        statusCode: 200,
        status: "Success",
        message: "Jadwal dokter berhasil diperbarui.",
        data: updatedJadwal,
      });
    } catch (error) {
      if (error.code === "P2025") {
        return res.status(404).json({
          statusCode: 404,
          status: "Failed",
          message: `Jadwal dokter dengan ID ${req.params.id} tidak ditemukan.`,
        });
      }
      res.status(500).json({
        statusCode: 500,
        status: "Failed",
        message: "Internal Server Error.",
        error: error.message,
      });
    }
  }
  static async deleteJadwalDokter(req, res) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({
          statusCode: 400,
          status: "Failed",
          message: "ID tidak valid.",
        });
      }

      const existingJadwal = await prisma.jadwalDokter.findUnique({
        where: { id_jadwal_dokter: id },
      });

      if (!existingJadwal) {
        return res.status(404).json({
          statusCode: 404,
          status: "Failed",
          message: `Jadwal dokter dengan ID ${id} tidak ditemukan.`,
        });
      }

      const data = await prisma.jadwalDokter.delete({
        where: { id_jadwal_dokter: id },
      });

      res.status(200).json({
        statusCode: 200,
        status: "Success",
        message: "Jadwal dokter berhasil dihapus.",
        data: data,
      });
    } catch (error) {
      res.status(500).json({
        statusCode: 500,
        status: "Failed",
        message: "Internal Server Error.",
        error: error.message,
      });
    }
  }
}

module.exports = JadwalDokterController;
