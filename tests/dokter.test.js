const supertest = require("supertest");
const app = require("../app");
const jwt = require("jsonwebtoken");
const cookie = require("cookie-signature");
const { cookieSecret, aksesSecret } = require("../src/configs/env-config");
const path = require("path");
const fs = require("fs");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

describe("SUKSES: test endpoint CRUD Dokter", () => {
  let signedToken;
  let createdDokterId;

  beforeAll(() => {
    // Create a real small test image if not exists
    const testFilePath = path.join(__dirname, "test-image.jpg");
    if (!fs.existsSync(testFilePath)) {
      const smallImageBuffer = Buffer.from(
        "/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////2wBDAf//////////////////////////////////////////////////////////////////////////////////////wAARCABAAEADASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAf/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AJVAH//Z",
        "base64"
      );
      fs.writeFileSync(testFilePath, smallImageBuffer);
    }
  });

  beforeEach(() => {
    const token = jwt.sign(
      {
        id_user: "okoko",
        nama: "Test Admin",
        email: "admin@gmail.com",
        no_wa: "08123456789",
        role: "ADMIN",
      },
      aksesSecret,
      { expiresIn: "15m" }
    );
    signedToken = cookie.sign(token, cookieSecret);
  });

  it("should create dokter successfully", async () => {
    const testFilePath = path.join(__dirname, "test-image.jpg");

    try {
      const response = await supertest(app)
        .post("/api/v1/dokter")
        .set("Cookie", [`aksesToken=s:${signedToken}`])
        .field("nama", "Dr. Upload Test")
        .field("id_poli", "0b4577fa-437b-4643-850d-5a4be524174b")
        .field("biodata_singkat", "Dokter uji coba upload")
        .field("link_linkedin", "https://linkedin.com/dr")
        .field("link_instagram", "https://instagram.com/dr")
        .field("link_facebook", "https://facebook.com/dr")
        .attach("file", testFilePath)
        .timeout(30000);

      console.log("Response:", response.body);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("data");
      expect(response.body.data).toHaveProperty("id");
      expect(response.body).toHaveProperty(
        "message",
        "Dokter berhasil ditambahkan"
      );

      // Store the created dokter ID for cleanup
      createdDokterId = response.body.data.id;
    } catch (error) {
      console.error("Test Error:", error);
      throw error;
    }
  });

  afterEach(async () => {
    if (createdDokterId) {
      try {
        await prisma.dokter.delete({
          where: { id_dokter: createdDokterId },
        });
      } catch (error) {
        console.error("Cleanup Error:", error);
      }
    }
  });

  afterAll(async () => {
    const testFilePath = path.join(__dirname, "test-image.jpg");
    if (fs.existsSync(testFilePath)) {
      fs.unlinkSync(testFilePath);
    }

    await prisma.$disconnect();
  });
});
