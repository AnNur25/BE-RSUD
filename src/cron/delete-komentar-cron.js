const cron = require("node-cron");
const prisma = require("../prisma/prismaClient");


cron.schedule("0 0 28 * *", async () => {
  try {
    const result = await prisma.komentar.deleteMany({
      where: { isVisible: false },
    });

    console.log(
      `[CRON] ${result.count} komentar non-visible berhasil dihapus.`
    );
  } catch (err) {
    console.error("[CRON] Gagal menghapus komentar non-visible:", err.message);
  }
});

//task otomatis dari sistem
