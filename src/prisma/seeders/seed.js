const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const users = [
  {
    id_user: "admin!@#$%^&*()QWERTYUI",
    nama: "Admin",
    email: "admin@gmail.com",
    password: "12345678",
  },
];

const berita = [
  {
    id_berita: "berita-1!@#$%^QWER",
    judul: "Berita Pertama",
    deskripsi: "Ini adalah deskripsi berita pertama.",
    gambar: "gambar1.jpg",
    waktu: new Date(),
    id_user: "admin!@#$%^&*()QWERTYUI",
  },
  {
    id_berita: "berita-2!@#qw!@#",
    judul: "Berita Kedua",
    deskripsi: "Ini adalah deskripsi berita kedua.",
    gambar: "gambar2.jpg",
    waktu: new Date(),
    id_user: "admin!@#$%^&*()QWERTYUI",
  },
  {
    id_berita: "berita-3!@#$%^QWER",
    judul: "Berita Pertama",
    deskripsi: "Ini adalah deskripsi berita pertama.",
    gambar: "gambar1.jpg",
    waktu: new Date(),
    id_user: "admin!@#$%^&*()QWERTYUI",
  },
  {
    id_berita: "berita-4!@#qw!@#",
    judul: "Berita Kedua",
    deskripsi: "Ini adalah deskripsi berita kedua.",
    gambar: "gambar2.jpg",
    waktu: new Date(),
    id_user: "admin!@#$%^&*()QWERTYUI",
  },
  {
    id_berita: "berita-5!@#qw!@#",
    judul: "Berita Kedua",
    deskripsi: "Ini adalah deskripsi berita kedua.",
    gambar: "gambar2.jpg",
    waktu: new Date(),
    id_user: "admin!@#$%^&*()QWERTYUI",
  },
  {
    id_berita: "berita-6!@#qw!@#",
    judul: "Berita Kedua",
    deskripsi: "Ini adalah deskripsi berita kedua.",
    gambar: "gambar2.jpg",
    waktu: new Date(),
    id_user: "admin!@#$%^&*()QWERTYUI",
  },
];

const aduan = [
  {
    id_aduan: "aduan-1@!$!^!#!rgwgw$%$",
    judul: "Aduan Pertama",
    deskripsi: "Ini adalah deskripsi aduan pertama.",
    no_wa: "081234567890",
  },
  {
    id_aduan: "aduan-2^@^^@%@hethd%#$",
    judul: "Aduan Kedua",
    deskripsi: "Ini adalah deskripsi aduan kedua.",
    no_wa: "081234567891",
  },
  {
    id_aduan: "aduan-3$%@%@$^@thr$%@%",
    judul: "Aduan Ketiga",
    deskripsi: "Ini adalah deskripsi aduan ketiga.",
    no_wa: "081234567892",
  },
  {
    id_aduan: "aduan-4#%$@htwt43$Y$^H",
    judul: "Aduan Keempat",
    deskripsi: "Ini adalah deskripsi aduan keempat.",
    no_wa: "081234567893",
  },
  {
    id_aduan: "aduan-5@##@%fhdthe%^$",
    judul: "Aduan Kelima",
    deskripsi: "Ini adalah deskripsi aduan kelima.",
    no_wa: "081234567894",
  },
];

const responAdmin = [
  {
    id_respon_admin: "respon-17948#$#$%fbggs",
    message: "Respon untuk aduan pertama.",
    id_aduan: "aduan-1@!$!^!#!rgwgw$%$",
    id_user: "admin!@#$%^&*()QWERTYUI",
  },
  {
    id_respon_admin: "respon-2nignierihi87459",
    message: "Respon untuk aduan kedua.",
    id_aduan: "aduan-2^@^^@%@hethd%#$",
    id_user: "admin!@#$%^&*()QWERTYUI",
  },
  {
    id_respon_admin: "respon-3$#@#@bgreger",
    message: "Respon untuk aduan ketiga.",
    id_aduan: "aduan-3$%@%@$^@thr$%@%",
    id_user: "admin!@#$%^&*()QWERTYUI",
  },
  {
    id_respon_admin: "respon-4*&297&*(*njndk",
    message: "Respon untuk aduan keempat.",
    id_aduan: "aduan-4#%$@htwt43$Y$^H",
    id_user: "admin!@#$%^&*()QWERTYUI",
  },
  {
    id_respon_admin: "respon-5(*48*&(*joneb",
    message: "Respon untuk aduan kelima.",
    id_aduan: "aduan-4#%$@htwt43$Y$^H",
    id_user: "admin!@#$%^&*()QWERTYUI",
  },
];

const pelayananDokter = [
  {
    id_pelayanan_dokter: "pelayanan-1!@#@$%rgb",
    nama_pelayanan: "Visitasi Rawat Inap",
    deskripsi: "Pelayanan konsultasi umum.",
    id_user: "admin!@#$%^&*()QWERTYUI",
  },
  {
    id_pelayanan_dokter: "pelayanan-2#$@%fdfbdb@#GR",
    nama_pelayanan: "Konsultasi IGD/RI",
    deskripsi: "Pelayanan konsultasi spesialis.",
    id_user: "admin!@#$%^&*()QWERTYUI",
  },
  {
    id_pelayanan_dokter: "pelayanan-3#$@%fdfbdb@#GR",
    nama_pelayanan: "Konsultasi Haemodialisa",
    deskripsi: "Pelayanan konsultasi spesialis.",
    id_user: "admin!@#$%^&*()QWERTYUI",
  },
  {
    id_pelayanan_dokter: "pelayanan-4#$@%fdfbdb@#GR",
    nama_pelayanan: "klinik rawat jalan",
    deskripsi: "Pelayanan konsultasi spesialis.",
    id_user: "admin!@#$%^&*()QWERTYUI",
  },
];

const pelayananRumahSakit = [
  {
    id_pelayananRS: "pelayananRS-1@$@$@ebbebb@#$@",
    Persyaratan: "Membawa KTP",
    Prosedur: "Registrasi di loket",
    JangkaWaktu: "1 hari",
    Biaya: 150000,
    id_user: "admin!@#$%^&*()QWERTYUI",
  },
  {
    id_pelayananRS: "pelayananRS-2@#$@BDBDB",
    Persyaratan: "Membawa surat rujukan",
    Prosedur: "Registrasi online",
    JangkaWaktu: "2 hari",
    Biaya: 250000,
    id_user: "admin!@#$%^&*()QWERTYUI",
  },
  {
    id_pelayananRS: "pelayanan-3^^&**%$##%jnvdvnj",
    Persyaratan: "Membawa kartu BPJS",
    Prosedur: "Verifikasi administrasi",
    JangkaWaktu: "3 hari",
    Biaya: 0,
    id_user: "admin!@#$%^&*()QWERTYUI",
  },
  {
    id_pelayananRS: "pelayanan-4(&(^&%&%bivbindno",
    Persyaratan: "Membawa hasil lab sebelumnya",
    Prosedur: "Registrasi ulang",
    JangkaWaktu: "2 hari",
    Biaya: 200000,
    id_user: "admin!@#$%^&*()QWERTYUI",
  },
  {
    id_pelayananRS: "pelayanan-5(&(&&())*ngreingd",
    Persyaratan: "Membawa kartu asuransi",
    Prosedur: "Verifikasi asuransi",
    JangkaWaktu: "1 hari",
    Biaya: 180000,
    id_user: "admin!@#$%^&*()QWERTYUI",
  },
];

const dokter = [
  {
    id_dokter: "dokter-1^&&*(ibverdbsj",
    nama: "dr. H. Agus Yudho Santoso, Sp.PD, Finasim ( AYS )",
    kontak: "081234567895",
    gambar: "dokter1.jpg",
    id_user: "admin!@#$%^&*()QWERTYUI",
    id_spesialis: "SP001&^*^*BUBU&(",
    id_pelayanan_dokter: "pelayanan-1!@#@$%rgb",
  },
  {
    id_dokter: "dokter-2(^*%&^((knb24225enbb3040",
    nama: "dr. Astu Anindya Jati, Sp.PD (AAJ)",
    kontak: "081234567896",
    gambar: "dokter2.jpg",
    id_user: "admin!@#$%^&*()QWERTYUI",
    id_spesialis: "SP002&^*^*BUB**U&(",
    id_pelayanan_dokter: "pelayanan-1!@#@$%rgb",
  },
  {
    id_dokter: "dokter-3(^*%&^((kn2342b3040",
    nama: "dr. Jualita Heidi Saputri, Sp.PD (JHS)",
    kontak: "081234567896",
    gambar: "dokter2.jpg",
    id_user: "admin!@#$%^&*()QWERTYUI",
    id_spesialis: "SP003)($^$^knk",
    id_pelayanan_dokter: "pelayanan-1!@#@$%rgb",
  },
  {
    id_dokter: "dokter-4(^***%&^((kn2342b3040",
    nama: "dr. Isty Rindryastuti, Sp.PD (RIN)",
    kontak: "081234567896",
    gambar: "dokter2.jpg",
    id_user: "admin!@#$%^&*()QWERTYUI",
    id_spesialis: "SP004*(&(*knjn*)*)",
    id_pelayanan_dokter: "pelayanan-2#$@%fdfbdb@#GR",
  },
  {
    id_dokter: "dokter-5(^*%&^((kn2342b3040",
    nama: "dr. Natalia Kristanti Nugraheni, Sp.A ( NAT )",
    kontak: "081234567896",
    gambar: "dokter2.jpg",
    id_user: "admin!@#$%^&*()QWERTYUI",
    id_spesialis: "SP005*(&(*ighbjbjknkjn",
    id_pelayanan_dokter: "pelayanan-2#$@%fdfbdb@#GR",
  },
  {
    id_dokter: "dokter-6(^*%&^((kn2342b3040",
    nama: "dr. Debora Pratita Acchedya Buntara, Sp.A (DPA)",
    kontak: "081234567896",
    gambar: "dokter2.jpg",
    id_user: "admin!@#$%^&*()QWERTYUI",
    id_spesialis: "SP006)**(&^*NKJNJK$@$$@HUI",
    id_pelayanan_dokter: "pelayanan-2#$@%fdfbdb@#GR",
  },
  {
    id_dokter: "dokter-7(^*%&^((kn2342b3040",
    nama: "dr. Moch. Sodiq Kukuh WS, Sp.OG (MSK)",
    kontak: "081234567896",
    gambar: "dokter2.jpg",
    id_user: "admin!@#$%^&*()QWERTYUI",
    id_spesialis: "SP006)**(&^*NKJNJK$@$$@HUI",
    id_pelayanan_dokter: "pelayanan-2#$@%fdfbdb@#GR",
  },
  {
    id_dokter: "dokter-8(^*%&^((kn2342b3040",
    nama: "dr. Dwi Cahya Febrimulya. M.Ked, Sp.OG (DIF)",
    kontak: "081234567896",
    gambar: "dokter2.jpg",
    id_user: "admin!@#$%^&*()QWERTYUI",
    id_spesialis: "SP006)**(&^*NKJNJK$@$$@HUI",
    id_pelayanan_dokter: "pelayanan-2#$@%fdfbdb@#GR",
  },
  {
    id_dokter: "dokter-9(^*%&^((kn2342b3040",
    nama: "dr. Miftahul Falah Ahmad, Sp.OG (MFA)",
    kontak: "081234567896",
    gambar: "dokter2.jpg",
    id_user: "admin!@#$%^&*()QWERTYUI",
    id_spesialis: "SP006)**(&^*NKJNJK$@$$@HUI",
    id_pelayanan_dokter: "pelayanan-2#$@%fdfbdb@#GR",
  },
  {
    id_dokter: "dokter-10(^*%&^((kn2342b3040",
    nama: "dr. H. M. Arief Heriawan, Sp.B, Finac (ARI)",
    kontak: "081234567896",
    gambar: "dokter2.jpg",
    id_user: "admin!@#$%^&*()QWERTYUI",
    id_spesialis: "SP006)**(&^*NKJNJK$@$$@HUI",
    id_pelayanan_dokter: "pelayanan-2#$@%fdfbdb@#GR",
  },
  {
    id_dokter: "dokter-11(^*%&^((kn2342b3040",
    nama: "dr. I Ketut Yante, Sp.B (IKY)",
    kontak: "081234567896",
    gambar: "dokter2.jpg",
    id_user: "admin!@#$%^&*()QWERTYUI",
    id_spesialis: "SP006)**(&^*NKJNJK$@$$@HUI",
    id_pelayanan_dokter: "pelayanan-2#$@%fdfbdb@#GR",
  },
  {
    id_dokter: "dokter-12(^*%&^((kn2342b3040",
    nama: "dr. Laksmi Indreswari, Sp.B (MIE)",
    kontak: "081234567896",
    gambar: "dokter2.jpg",
    id_user: "admin!@#$%^&*()QWERTYUI",
    id_spesialis: "SP006)**(&^*NKJNJK$@$$@HUI",
    id_pelayanan_dokter: "pelayanan-2#$@%fdfbdb@#GR",
  },
];

const spesialis = [
  {
    id_Spesialis: "SP001&^*^*BUBU&(",
    nama_spesialis: "Dokter Spesialis Penyakit Dalam",
    deskripsi:
      "Menangani berbagai penyakit yang menyerang organ dalam seperti jantung, paru-paru, pencernaan, ginjal, dan hati. Bertanggung jawab dalam diagnosis serta perawatan tanpa tindakan bedah.",
    id_user: "admin!@#$%^&*()QWERTYUI",
  },
  {
    id_Spesialis: "SP002&^*^*BUB**U&(",
    nama_spesialis: "Dokter Spesialis Anak",
    deskripsi:
      "Fokus pada kesehatan bayi, anak-anak, dan remaja. Meliputi perawatan penyakit anak, imunisasi, tumbuh kembang, serta konsultasi gizi dan pola hidup sehat.",
    id_user: "admin!@#$%^&*()QWERTYUI",
  },
  {
    id_Spesialis: "SP003)($^$^knk",
    nama_spesialis: "Dokter Spesialis Kebidanan dan Kandungan",
    deskripsi:
      "Menangani kesehatan reproduksi wanita, kehamilan, persalinan, serta gangguan kandungan seperti infertilitas, PCOS, dan endometriosis.",
    id_user: "admin!@#$%^&*()QWERTYUI",
  },
  {
    id_Spesialis: "SP004*(&(*knjn*)*)",
    nama_spesialis: "Dokter Spesialis Bedah Umum",
    deskripsi:
      "Melakukan prosedur operasi umum seperti usus buntu, hernia, tumor, dan cedera trauma. Bertanggung jawab terhadap perawatan sebelum dan sesudah operasi.",
    id_user: "admin!@#$%^&*()QWERTYUI",
  },
  {
    id_Spesialis: "SP005*(&(*ighbjbjknkjn",
    nama_spesialis: "Dokter Spesialis Bedah Orthopedi",
    deskripsi:
      "Menangani penyakit dan cedera pada sistem gerak tubuh seperti patah tulang, cedera olahraga, skoliosis, serta penggantian sendi.",
    id_user: "admin!@#$%^&*()QWERTYUI",
  },
  {
    id_Spesialis: "SP006)**(&^*NKJNJK$@$$@HUI",
    nama_spesialis: "Dokter Spesialis Saraf",
    deskripsi:
      "Mendiagnosis dan mengobati gangguan sistem saraf seperti stroke, epilepsi, Alzheimer, multiple sclerosis, dan penyakit Parkinson.",
    id_user: "admin!@#$%^&*()QWERTYUI",
  },
];

const jadwalDokter = [
  {
    id_jadwal_dokter: "jadwalDokter-1*(^*hgi&@#$%97359",
    id_Sesi: "sesi-2*(^*hgi&@@&*&973%&#kj59",
    id_Hari: "hari-3*(^*hgi&*^%#%^*&*&97359",
    id_dokter: "dokter-12(^*%&^((kn2342b3040",
    id_jamkerja: "jamkerja-2*(^*hgi&&)*&(^*%*&97359*",
    id_user: "admin!@#$%^&*()QWERTYUI",
  },
  {
    id_jadwal_dokter: "jadwalDokter-2*(^*hgi&&*&9735!9",
    id_Sesi: "sesi-2*(^*hgi&@@&*&973%&#kj59",
    id_Hari: "hari-1*(^))(%##*hgi&&*&97359",
    id_dokter: "dokter-11(^*%&^((kn2342b3040",
    id_jamkerja: "jamkerja-2*(^*hgi&&)*&(^*%*&97359*",
    id_user: "admin!@#$%^&*()QWERTYUI",
  },
  {
    id_jadwal_dokter: "jadwalDokter-3*(^*hgi&&*&97359",
    id_Sesi: "sesi-1*(^*hgi&&*&973()()()59",
    id_Hari: "hari-1*(^))(%##*hgi&&*&97359",
    id_dokter: "dokter-10(^*%&^((kn2342b3040",
    id_jamkerja: "jamkerja-1*(^*hgi&&*&$&&*&97359",
    id_user: "admin!@#$%^&*()QWERTYUI",
  },
];

const sesi = [
  {
    id_Sesi: "sesi-1*(^*hgi&&*&973()()()59",
    sesi: "Pagi",
    id_user: "admin!@#$%^&*()QWERTYUI",
  },
  {
    id_Sesi: "sesi-2*(^*hgi&@@&*&973%&#kj59",
    sesi: "Siang",
    id_user: "admin!@#$%^&*()QWERTYUI",
  },
  {
    id_Sesi: "sesi-2*(^*!@hgi&&*&973%&#kj59",
    sesi: "Sore",
    id_user: "admin!@#$%^&*()QWERTYUI",
  },
  {
    id_Sesi: "sesi-2*(^*$%hgi&&*&973%&#kj59",
    sesi: "Malam",
    id_user: "admin!@#$%^&*()QWERTYUI",
  },
];

const hari = [
  {
    id_Hari: "hari-1*(^))(%##*hgi&&*&97359",
    hari_mulai: "Senin",
    hari_selesai: "Rabu",
    id_user: "admin!@#$%^&*()QWERTYUI",
  },
  {
    id_Hari: "hari-2*(^*hgi&*^%#%^*&*&9@@73591",
    hari_mulai: "Selasa",
    hari_selesai: "Kamis",
    id_user: "admin!@#$%^&*()QWERTYUI",
  },
  {
    id_Hari: "hari-3*(^*hgi&*^%#%^*&*&97359",
    hari_mulai: "Jumat",
    hari_selesai: "Kamis",
    id_user: "admin!@#$%^&*()QWERTYUI",
  },
];

const jamkerja = [
  {
    id_Jamkerja: "jamkerja-1*(^*hgi&&*&$&&*&97359",
    jam_mulai: "08:00",
    jam_selesai: "09:00",
    id_user: "admin!@#$%^&*()QWERTYUI",
  },
  {
    id_Jamkerja: "jamkerja-2*(^*hgi&&)*&(^*%*&97359*",
    jam_mulai: "09:00",
    jam_selesai: "10:00",
    id_user: "admin!@#$%^&*()QWERTYUI",
  },
  {
    id_Jamkerja: "jamkerja-2*(^*hgi&&)*&(^*%*&97359",
    jam_mulai: "16:00",
    jam_selesai: "20:00",
    id_user: "admin!@#$%^&*()QWERTYUI",
  },
];

async function main() {
  await prisma.jadwalDokter.deleteMany();
  await prisma.jamkerja.deleteMany();
  await prisma.hari.deleteMany();
  await prisma.sesi.deleteMany();
  await prisma.dokter.deleteMany();
  await prisma.spesialis.deleteMany();
  await prisma.pelayananRumahSakit.deleteMany();
  await prisma.pelayananDokter.deleteMany();
  await prisma.responAdmin.deleteMany();
  await prisma.aduan.deleteMany();
  await prisma.berita.deleteMany();
  await prisma.user.deleteMany();

  await prisma.user.createMany({ data: users });
  await prisma.berita.createMany({ data: berita });
  await prisma.aduan.createMany({ data: aduan });
  await prisma.responAdmin.createMany({ data: responAdmin });
  await prisma.pelayananDokter.createMany({ data: pelayananDokter });
  await prisma.pelayananRumahSakit.createMany({ data: pelayananRumahSakit });
  await prisma.spesialis.createMany({ data: spesialis });
  await prisma.dokter.createMany({ data: dokter });
  await prisma.sesi.createMany({ data: sesi });
  await prisma.hari.createMany({ data: hari });
  await prisma.jamkerja.createMany({ data: jamkerja });
  await prisma.jadwalDokter.createMany({ data: jadwalDokter });

  console.log("Data seeder berhasil ditambahkan!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
