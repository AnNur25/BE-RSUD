module.exports = {
  mapDokterResponse(jadwalList) {
    const grouped = {};

    jadwalList.forEach((item) => {
      const { dokter, pelayanan, hari, sesi, jam_mulai, jam_selesai } = item;

      if (!grouped[dokter.id_dokter]) {
        grouped[dokter.id_dokter] = {
          id_dokter: dokter.id_dokter,
          nama_dokter: dokter.nama,
          gambar_dokter: dokter.gambar,
          poli: dokter.poli,
          layananList: [],
        };
      }

      let layanan = grouped[dokter.id_dokter].layananList.find(
        (l) => l.id_pelayanan === pelayanan.id_pelayanan
      );

      if (!layanan) {
        layanan = {
          id_pelayanan: pelayanan.id_pelayanan,
          nama_pelayanan: pelayanan.nama_pelayanan,
          jadwal: [],
        };
        grouped[dokter.id_dokter].layananList.push(layanan);
      }

      if (hari) {
        layanan.jadwal.push({ hari, sesi, jam_mulai, jam_selesai });
      }
    });

    return Object.values(grouped);
  },
};
