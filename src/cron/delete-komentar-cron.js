const cron = require("node-cron");
const moment = require("moment-timezone");
const prisma = require("../prisma/prismaClient"); // sesuaikan path prisma

cron.schedule(
  "0 0 1 * *", // Setiap tanggal 1 jam 00:00 WIB
  async () => {
    const now = moment().tz("Asia/Jakarta");
    console.log("[DEBUG] Sekarang (Asia/Jakarta):", now.format());

    try {
      const waktu = now.toDate(); // valid date object
      if (isNaN(waktu.getTime())) {
        throw new Error("❌ Invalid date saat cron dijalankan");
      }

      const result = await prisma.komentar.deleteMany({
        where: { isVisible: false },
      });

      console.log(
        `[CRON] ${result.count} komentar non-visible berhasil dihapus.`
      );
    } catch (err) {
      console.error("[CRON] Gagal menghapus komentar non-visible:", err);
    }
  },
  {
    timezone: "Asia/Jakarta",
  }
);
