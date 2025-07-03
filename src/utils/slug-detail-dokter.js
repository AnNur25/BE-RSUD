const slugify = require("slugify");
const prisma = require("../prisma/prismaClient");
async function generateUniqueSlug(nama) {
  const baseSlug = slugify(nama, { lower: true, strict: true });
  let slug = baseSlug;
  let count = 1;

  while (await prisma.dokter.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${count}`;
    count++;
  }

  return slug;
}

module.exports = generateUniqueSlug;
