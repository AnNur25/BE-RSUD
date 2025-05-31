// const cron = require("node-cron");
// const prisma = require("../prisma/prismaClient");

// cron.schedule(
//   "0 0 * * *", //setiap hari pukul 00:00 (tengah malam)
//   async () => {
//     try {
//       const result = await prisma.revokedToken.deleteMany({
//         where: { expiresAt: { lt: new Date() } },
//       });

//       console.log(`[CRON] ${result.count} revoked token berhasil dihapus.`);
//     } catch (err) {
//       console.error("[CRON] Gagal menghapus revoked token:", err.message);
//     }
//   },
//   {
//     timezone: "Asia/Jakarta",
//   }
// );
