const prisma = require("../prisma/prismaClient");

class PelayananDokterController {
    static async addPelayananDokter(req, res) {
        const { nama_pelayanan, deskripsi } = req.body;
        try {
            const pelayananDokter = await prisma.pelayananDokter.create({
                data: {
                    nama_pelayanan,
                    deskripsi
                }
            });
            res.json(pelayananDokter);
        } catch (error) {
            res.json({ error: error.message });
        }
    }

}
module.exports = PelayananDokterController;