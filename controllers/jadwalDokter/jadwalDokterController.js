const { Hari } = require("@prisma/client");
const prisma = require("../../prisma/prismaClient");

class JadwalDokterController {
  static async createJadwalDokter(req, res) {
    try {
      const { jadwalList } = req.body;
      const id_user = req.user.id_user;

      if (!Array.isArray(jadwalList) || jadwalList.length === 0) {
        return res.status(400).json({
          statusCode: 400,
          status: "Failed",
          message: "Data jadwal harus berupa array dan tidak boleh kosong.",
        });
      }

      const groupedJadwal = {};
      let totalJadwal = 0;

      for (const jadwal of jadwalList) {
        const { id_dokter, hariList } = jadwal;

        const dokter = await prisma.dokter.findUnique({
          where: { id_dokter },
        });

        if (!dokter) {
          return res.status(404).json({
            statusCode: 404,
            status: "Failed",
            message: `Dokter dengan ID ${id_dokter} tidak ditemukan.`,
          });
        }

        for (const hariData of hariList) {
          const { hari, jam_mulai, jam_selesai } = hariData;

          if (!hari || !jam_mulai || !jam_selesai) {
            return res.status(400).json({
              statusCode: 400,
              status: "Failed",
              message:
                "Setiap jadwal harus memiliki hari, jam_mulai, dan jam_selesai.",
            });
          }

          const normalizedHari =
            hari.charAt(0).toUpperCase() + hari.slice(1).toLowerCase();

          if (!Object.values(Hari).includes(normalizedHari)) {
            return res.status(400).json({
              statusCode: 400,
              status: "Failed",
              message: `Hari '${hari}' tidak valid. Gunakan salah satu dari: ${Object.values(
                Hari
              ).join(", ")}`,
            });
          }

          const startHour = parseInt(jam_mulai.split(":")[0]);
          const endHour = parseInt(jam_selesai.split(":")[0]);

          let sesi = "";
          if (startHour >= 7 && endHour <= 14) {
            sesi = "Pagi";
          } else if (startHour >= 14 && endHour <= 20) {
            sesi = "Sore";
          } else {
            sesi = "Malam";
          }

          await prisma.jadwalDokter.create({
            data: {
              id_dokter,
              id_user,
              hari: normalizedHari,
              sesi,
              jam_mulai,
              jam_selesai,
            },
          });

          if (!groupedJadwal[id_dokter]) {
            groupedJadwal[id_dokter] = {
              id_dokter,
              jadwal: [],
            };
          }

          groupedJadwal[id_dokter].jadwal.push({
            hari: normalizedHari,
            sesi,
            jam_mulai,
            jam_selesai,
          });

          totalJadwal++;
        }
      }

      return res.status(201).json({
        statusCode: 201,
        status: "Success",
        message: "Jadwal dokter berhasil ditambahkan.",
        dokter: Object.values(groupedJadwal),
        total_jadwal: totalJadwal,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        statusCode: 500,
        status: "Failed",
        message: "Terjadi kesalahan pada server.",
        error: error.message,
      });
    }
  }

  static async getJadwalDokter(req, res) {
    try {
      // Mengambil semua jadwal dokter beserta informasi terkait
      const jadwalDokter = await prisma.jadwalDokter.findMany({
        include: {
          dokter: {
            select: {
              id_dokter: true,
              nama: true,
              gambar: true,
              spesialis: {
                select: {
                  id_Spesialis: true,
                  nama_spesialis: true,
                },
              },
              pelayananDokter: {
                select: {
                  id_pelayanan_dokter: true,
                  nama_pelayanan: true,
                },
              },
            },
          },
        },
      });

      // Mengelompokkan jadwal berdasarkan dokter
      const groupedJadwal = {};
      const spesialisCount = {};
      let totalJadwal = 0;

      jadwalDokter.forEach((jadwal) => {
        const { id_dokter, nama, gambar, spesialis, pelayananDokter } =
          jadwal.dokter;

        if (!groupedJadwal[id_dokter]) {
          groupedJadwal[id_dokter] = {
            id_dokter,
            nama_dokter: nama,
            gambar_dokter: gambar,
            spesialis: {
              id: spesialis.id_Spesialis,
              nama: spesialis.nama_spesialis,
            },
            pelayanan: {
              id: pelayananDokter.id_pelayanan_dokter,
              nama: pelayananDokter.nama_pelayanan,
            },
            jadwal: [],
          };
        }

        groupedJadwal[id_dokter].jadwal.push({
          hari: jadwal.hari,
          sesi: jadwal.sesi,
          jam_mulai: jadwal.jam_mulai,
          jam_selesai: jadwal.jam_selesai,
        });

        // Menghitung total jadwal per spesialis
        if (!spesialisCount[spesialis.id_Spesialis]) {
          spesialisCount[spesialis.id_Spesialis] = {
            id_spesialis: spesialis.id_Spesialis,
            nama: spesialis.nama_spesialis,
            total_jadwal: 0,
          };
        }
        spesialisCount[spesialis.id_Spesialis].total_jadwal++;
        totalJadwal++;
      });

      return res.status(200).json({
        statusCode: 200,
        status: "Success",
        message: "Data jadwal dokter berhasil diambil.",
        dokter: Object.values(groupedJadwal),
        total_jadwal: totalJadwal,
        total_jadwal_per_spesialis: Object.values(spesialisCount),
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        statusCode: 500,
        status: "Failed",
        message: "Terjadi kesalahan pada server.",
        error: error.message,
      });
    }
  }

  static async searchJadwalDokter(req, res) {
    try {
      const { id_Spesialis, tanggal } = req.query;

      if (!id_Spesialis || !tanggal) {
        return res.status(400).json({
          statusCode: 400,
          status: "Failed",
          message: "ID Spesialis dan Tanggal diperlukan",
        });
      }

      // Konversi tanggal (YYYY-MM-DD) menjadi nama hari (Senin, Selasa, etc.)
      const dateObj = new Date(tanggal);
      const hariList = [
        "Minggu",
        "Senin",
        "Selasa",
        "Rabu",
        "Kamis",
        "Jumat",
        "Sabtu",
      ];
      const hariNama = hariList[dateObj.getDay()]; // Ambil nama hari sesuai tanggal

      // Cari jadwal dokter berdasarkan id_spesialis dan hari yang sesuai dengan tanggal
      const jadwalDokter = await prisma.jadwalDokter.findMany({
        where: {
          dokter: {
            spesialis: {
              id_Spesialis: id_Spesialis,
            },
          },
          hari: hariNama, // Mencocokkan hari yang sesuai dengan tanggal
        },
        include: {
          dokter: {
            select: {
              id_dokter: true,
              nama: true,
              gambar: true,
              spesialis: {
                select: {
                  id_Spesialis: true,
                  nama_spesialis: true,
                },
              },
              pelayananDokter: {
                select: {
                  id_pelayanan_dokter: true,
                  nama_pelayanan: true,
                },
              },
            },
          },
        },
      });

      if (jadwalDokter.length === 0) {
        return res.status(404).json({
          statusCode: 404,
          status: "Not Found",
          message: `Tidak ada jadwal dokter untuk spesialis ini pada hari ${hariNama} (${tanggal}).`,
        });
      }

      // Mengelompokkan jadwal berdasarkan dokter
      const groupedJadwal = {};
      let totalJadwal = 0;

      jadwalDokter.forEach((jadwal) => {
        const { id_dokter, nama, gambar, spesialis, pelayananDokter } =
          jadwal.dokter;

        if (!groupedJadwal[id_dokter]) {
          groupedJadwal[id_dokter] = {
            id_dokter,
            nama_dokter: nama,
            gambar_dokter: gambar,
            spesialis: {
              id: spesialis.id_Spesialis,
              nama: spesialis.nama_spesialis,
            },
            pelayanan: {
              id: pelayananDokter.id_pelayanan_dokter,
              nama: pelayananDokter.nama_pelayanan,
            },
            jadwal: [],
          };
        }

        groupedJadwal[id_dokter].jadwal.push({
          hari: jadwal.hari,
          sesi: jadwal.sesi,
          jam_mulai: jadwal.jam_mulai,
          jam_selesai: jadwal.jam_selesai,
        });

        totalJadwal++;
      });

      return res.status(200).json({
        statusCode: 200,
        status: "Success",
        message: `Data jadwal dokter untuk hari ${hariNama} (${tanggal}) berhasil diambil.`,
        dokter: Object.values(groupedJadwal),
        total_jadwal: totalJadwal,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        statusCode: 500,
        status: "Failed",
        message: "Terjadi kesalahan pada server.",
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
