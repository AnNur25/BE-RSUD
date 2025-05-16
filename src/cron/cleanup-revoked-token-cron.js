const cron = require("node-cron");
const prisma = require("../prisma/prismaClient");


cron.schedule("0 0 * * *", async () => {
  await prisma.revokedToken.deleteMany({
    where: { expiresAt: { lt: new Date() } },
  });
});
