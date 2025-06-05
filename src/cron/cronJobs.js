const cron = require("node-cron");
const moment = require("moment-timezone");
const prisma = require("../prisma/prismaClient");

console.log("🚀 Starting RSUD Cron Jobs...");
console.log(
  "⏰ Current time:",
  moment().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss")
);

// ===== CRON JOB 1: CLEANUP EXPIRED TOKENS =====
cron.schedule(
  "0 1 * * *",
  // "*/3 * * * *",
  async () => {
    const now = moment().tz("Asia/Jakarta");
    console.log("\n" + "=".repeat(50));
    console.log("🗑️  [TOKEN CLEANUP] Started:", now.format("HH:mm:ss"));

    try {
      const result = await prisma.revokedToken.deleteMany({
        where: { expiresAt: { lt: new Date() } },
      });

      if (result.count > 0) {
        console.log(`✅ ${result.count} expired tokens deleted`);
      } else {
        console.log(`ℹ️  No expired tokens to delete`);
      }
    } catch (err) {
      console.error("❌ Token cleanup failed:", err.message);
    }

    console.log("🏁 [TOKEN CLEANUP] Finished");
    console.log("=".repeat(50));
  },
  {
    timezone: "Asia/Jakarta",
  }
);

// ===== CRON JOB 2: CLEANUP NON-VISIBLE COMMENTS =====
cron.schedule(
  "0 1 1 * *",
  // "*/5 * * * *",
  async () => {
    const now = moment().tz("Asia/Jakarta");
    console.log("\n" + "=".repeat(50));
    console.log("💬 [COMMENT CLEANUP] Started:", now.format("HH:mm:ss"));

    try {
      const countBefore = await prisma.komentar.count({
        where: { isVisible: false },
      });

      console.log(`📊 Found ${countBefore} non-visible comments`);

      const result = await prisma.komentar.deleteMany({
        where: { isVisible: false },
      });

      if (result.count > 0) {
        console.log(`✅ ${result.count} non-visible comments deleted`);
      } else {
        console.log(`ℹ️  No non-visible comments to delete`);
      }
    } catch (err) {
      console.error("❌ Comment cleanup failed:", err.message);
    }

    console.log("🏁 [COMMENT CLEANUP] Finished");
    console.log("=".repeat(50));
  },
  {
    timezone: "Asia/Jakarta",
  }
);

// ===== STARTUP INFO =====
console.log("\n📋 Scheduled Jobs:");
console.log("  • Token Cleanup: Daily at 13:00 (Asia/Jakarta)");
console.log("  • Comment Cleanup: Daily at 14:00 (Asia/Jakarta)");
console.log("\n✨ All cron jobs are now active!");

// ===== GRACEFUL SHUTDOWN =====
process.on("SIGINT", () => {
  console.log("\n🛑 Shutting down cron jobs...");
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("\n🛑 Received SIGTERM, shutting down gracefully...");
  process.exit(0);
});

