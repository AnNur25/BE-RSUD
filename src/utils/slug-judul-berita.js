const slugify = require("slugify");
const prisma = require("../prisma/prismaClient");
async function generateUniqueSlug(judul) {
  const baseSlug = slugify(judul, { lower: true, strict: true });
  let slug = baseSlug;
  let count = 1;

  while (await prisma.berita.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${count}`;
    count++;
  }

  return slug;
}

module.exports = generateUniqueSlug;
