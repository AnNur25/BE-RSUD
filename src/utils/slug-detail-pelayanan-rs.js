const slugify = require("slugify");
const prisma = require("../prisma/prismaClient");
async function generateUniqueSlug(nama_pelayanan) {
  const baseSlug = slugify(nama_pelayanan, { lower: true, strict: true });
  let slug = baseSlug;
  let count = 1;

  while (await prisma.pelayanan.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${count}`;
    count++;
  }

  return slug;
}

module.exports = generateUniqueSlug;
