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
          Hari: { select: { id_Hari: true, hari: true } },
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
          nama: jadwal.Hari.hari,
        },
        jam_kerja: {
          id: jadwal.jamkerja.id_Jamkerja,
          jam_mulai: new Date(jadwal.jamkerja.jam_mulai).toLocaleTimeString(
            "id-ID",
            {
              hour: "2-digit",
              minute: "2-digit",
            }
          ),
          jam_selesai: new Date(jadwal.jamkerja.jam_selesai).toLocaleTimeString(
            "id-ID",
            {
              hour: "2-digit",
              minute: "2-digit",
            }
          ),
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
