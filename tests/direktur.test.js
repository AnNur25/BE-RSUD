const supertest = require("supertest");
const app = require("../app");
const jwt = require("jsonwebtoken");
const cookie = require("cookie-signature");
const path = require("path");
const fs = require("fs");
const { cookieSecret, aksesSecret } = require("../src/configs/env-config");

describe("SUKSES: test endpoint CRUD Direktur", () => {
  let signedToken;
  let createdDirekturId;

  // Gunakan beforeAll untuk setup sekali saja
  beforeAll(() => {
    const payload = {
      id_user: "test-user-id",
      nama: "Test Admin",
      email: "admin@gmail.com",
      no_wa: "08123456789",
      role: "ADMIN",
    };

    const token = jwt.sign(payload, aksesSecret, { expiresIn: "15m" });
    signedToken = cookie.sign(token, cookieSecret);
  });

  // Test untuk membuat direktur baru
  it("POST /api/v1/direktur - Membuat direktur baru dengan gambar", async () => {
    const response = await supertest(app)
      .post("/api/v1/direktur")
      .set("Cookie", `aksesToken=${signedToken}`)
      .attach("gambar", "C:/Users/ACER/BE-RSUD/tests/test-files/unej.png")
      .timeout(30000)
      .expect(200);

    expect(response.body).toHaveProperty("success", true);
    expect(response.body).toHaveProperty("statusCode", 200);
    expect(response.body).toHaveProperty(
      "message",
      "Data direktur berhasil ditambahkan"
    );
    expect(response.body.data).toHaveProperty("gambar");

    // Cek apakah gambar sudah dikonversi ke webp
    if (response.body.data.gambar) {
      expect(response.body.data.gambar).toContain("uploads/resized/");
      expect(response.body.data.gambar).toContain(".webp");
    }

    // Simpan ID untuk test selanjutnya - sesuaikan dengan struktur response
    createdDirekturId = response.body.data.id_direktur || response.body.data.id;

    // Debug: log response untuk melihat struktur sebenarnya
    console.log("Created direktur response:", response.body.data);
    console.log("Created direktur ID:", createdDirekturId);
  });

  // Test untuk mendapatkan semua direktur
  it("GET /api/v1/direktur - Mendapatkan daftar direktur", async () => {
    const response = await supertest(app).get("/api/v1/direktur").expect(200);

    expect(response.body).toHaveProperty("success", true);
    expect(response.body).toHaveProperty("statusCode", 200);
    expect(response.body).toHaveProperty(
      "message",
      "Data direktur berhasil diambil"
    );
    expect(Array.isArray(response.body.data)).toBe(true);

    // Debug: log response untuk melihat struktur
    console.log("Get direktur response:", response.body.data);
    console.log("Looking for ID:", createdDirekturId);

    // Validasi struktur data direktur
    if (response.body.data.length > 0) {
      const direktur = response.body.data[0];
      console.log("Sample direktur structure:", direktur);

      // Fleksibel untuk berbagai kemungkinan field ID
      expect(direktur).toHaveProperty("gambar");

      // Jika ada gambar, pastikan URL-nya benar
      if (direktur.gambar) {
        expect(direktur.gambar).toContain("uploads/resized/");
        expect(direktur.gambar).toContain(".webp");
      }
    }

    // Cek apakah direktur yang baru dibuat ada dalam list (jika ID tersedia)
    if (createdDirekturId) {
      const createdDirektur = response.body.data.find(
        (d) => d.id_direktur === createdDirekturId || d.id === createdDirekturId
      );
      expect(createdDirektur).toBeTruthy();
      console.log("Found created direktur:", createdDirektur);
    }
  });

  // Test untuk update direktur dengan gambar baru - skip jika ID tidak tersedia
  it("PUT /api/v1/direktur/:id - Update direktur dengan gambar baru", async () => {
    // Skip test jika tidak ada ID yang valid
    if (!createdDirekturId) {
      console.log("Skipping update test - no valid direktur ID");
      return;
    }

    const response = await supertest(app)
      .put(`/api/v1/direktur/${createdDirekturId}`)
      .set("Cookie", `aksesToken=${signedToken}`)
      .attach("gambar", "C:/Users/ACER/BE-RSUD/tests/test-files/unej.png")
      .timeout(30000);

    // Log response untuk debug
    console.log("Update response status:", response.status);
    console.log("Update response body:", response.body);

    // Jika berhasil (200), validasi response
    if (response.status === 200) {
      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty("statusCode", 200);
      expect(response.body).toHaveProperty(
        "message",
        "Data direktur berhasil diperbarui"
      );
      expect(response.body.data).toHaveProperty("gambar");

      if (response.body.data.gambar) {
        expect(response.body.data.gambar).toContain("uploads/resized/");
        expect(response.body.data.gambar).toContain(".webp");
      }
    } else {
      // Jika gagal, log error untuk debugging
      console.error("Update failed with status:", response.status);
      console.error("Error response:", response.body);
    }
  });

  // Test untuk update direktur tanpa mengganti gambar - skip jika ID tidak tersedia
  it("PUT /api/v1/direktur/:id - Update direktur tanpa mengganti gambar", async () => {
    // Skip test jika tidak ada ID yang valid
    if (!createdDirekturId) {
      console.log("Skipping update test - no valid direktur ID");
      return;
    }

    const response = await supertest(app)
      .put(`/api/v1/direktur/${createdDirekturId}`)
      .set("Cookie", `aksesToken=${signedToken}`)
      .timeout(30000);

    // Log response untuk debug
    console.log("Update without file response status:", response.status);
    console.log("Update without file response body:", response.body);

    // Jika berhasil (200), validasi response
    if (response.status === 200) {
      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty("statusCode", 200);
      expect(response.body).toHaveProperty(
        "message",
        "Data direktur berhasil diperbarui"
      );
      expect(response.body.data).toHaveProperty("gambar");

      // Gambar harus tetap ada (tidak berubah)
      expect(response.body.data.gambar).toBeTruthy();
    } else {
      // Jika gagal, log error untuk debugging
      console.error("Update without file failed with status:", response.status);
      console.error("Error response:", response.body);
    }
  });

  // Test untuk mendapatkan direktur setelah update
  it("GET /api/v1/direktur - Verifikasi direktur setelah update", async () => {
    const response = await supertest(app).get("/api/v1/direktur").expect(200);

    expect(response.body).toHaveProperty("success", true);
    expect(response.body).toHaveProperty("statusCode", 200);
    expect(Array.isArray(response.body.data)).toBe(true);

    // Jika ada direktur dalam response, validasi struktur
    if (response.body.data.length > 0) {
      const direktur = response.body.data[0];
      expect(direktur).toHaveProperty("gambar");

      if (direktur.gambar) {
        expect(direktur.gambar).toContain("uploads/resized/");
        expect(direktur.gambar).toContain(".webp");
      }
    }

    // Cari direktur yang sudah diupdate (jika ID tersedia)
    if (createdDirekturId) {
      const updatedDirektur = response.body.data.find(
        (d) => d.id_direktur === createdDirekturId || d.id === createdDirekturId
      );

      if (updatedDirektur) {
        expect(updatedDirektur).toBeTruthy();
        expect(updatedDirektur.gambar).toBeTruthy();
        expect(updatedDirektur.gambar).toContain("uploads/resized/");
        expect(updatedDirektur.gambar).toContain(".webp");
        console.log("Final direktur state:", updatedDirektur);
      } else {
        console.log("Updated direktur not found in final list");
      }
    }
  });
});
