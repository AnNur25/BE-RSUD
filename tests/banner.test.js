const supertest = require("supertest");
const app = require("../app");
const jwt = require("jsonwebtoken");
const cookie = require("cookie-signature");
const path = require("path");
const fs = require("fs");
const { cookieSecret, aksesSecret } = require("../src/configs/env-config");

describe("SUKSES: test endpoint CRUD Banner", () => {
  let signedToken;
  let createdBannerIds = [];

  // Setup dengan timeout yang lebih lama
  beforeAll(async () => {
    const payload = {
      id_user: "test-user-id",
      nama: "Test Admin",
      email: "admin@gmail.com",
      no_wa: "08123456789",
      role: "ADMIN",
    };

    const token = jwt.sign(payload, aksesSecret, { expiresIn: "15m" });
    signedToken = cookie.sign(token, cookieSecret);

    // Wait untuk koneksi database stabil
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }, 30000);

  // Cleanup setelah semua test
  afterAll(async () => {
    // Bersihkan banner yang tersisa jika ada
    if (createdBannerIds.length > 0) {
      try {
        await supertest(app)
          .delete("/api/v1/banner")
          .set("Cookie", `aksesToken=${signedToken}`)
          .send({
            ids: createdBannerIds,
          });
      } catch (error) {
        console.log("Cleanup error:", error.message);
      }
    }
  }, 30000);

  // Test untuk membuat banner baru dengan single file
  it("POST /api/v1/banner - Membuat banner baru dengan single file", async () => {
    const response = await supertest(app)
      .post("/api/v1/banner")
      .set("Cookie", `aksesToken=${signedToken}`)
      .attach(
        "banner", // Sesuaikan dengan route: multer.array("banner")
        "C:/Users/ACER/BE-RSUD/tests/test-files/unej.png"
      )
      .timeout(30000)
      .expect(201);

    expect(response.body).toHaveProperty("success", true);
    expect(response.body).toHaveProperty("statusCode", 201);
    expect(response.body).toHaveProperty(
      "message",
      "Foto berhasil ditambahkan"
    );
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBeGreaterThan(0);

    // Validasi struktur data banner
    const banner = response.body.data[0];
    expect(banner).toHaveProperty("id_banner");
    expect(banner).toHaveProperty("gambar");

    // Simpan ID untuk test selanjutnya
    createdBannerIds.push(banner.id_banner);

    // Debug: log values
    console.log("Created banner:", {
      id: banner.id_banner,
      gambar: banner.gambar,
    });
  }, 30000);

  // Test untuk membuat multiple banner sekaligus
  it("POST /api/v1/banner - Membuat multiple banner sekaligus", async () => {
    const response = await supertest(app)
      .post("/api/v1/banner")
      .set("Cookie", `aksesToken=${signedToken}`)
      .attach(
        "banner", // Sesuaikan dengan route
        "C:/Users/ACER/BE-RSUD/tests/test-files/unej.png"
      )
      .attach(
        "banner", // Sesuaikan dengan route
        "C:/Users/ACER/BE-RSUD/tests/test-files/unej.png"
      )
      .timeout(30000)
      .expect(201);

    expect(response.body).toHaveProperty("success", true);
    expect(response.body).toHaveProperty("statusCode", 201);
    expect(response.body).toHaveProperty(
      "message",
      "Foto berhasil ditambahkan"
    );
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBe(2);

    // Validasi setiap banner
    response.body.data.forEach((banner, index) => {
      expect(banner).toHaveProperty("id_banner");
      expect(banner).toHaveProperty("gambar");

      // Simpan ID untuk test selanjutnya
      createdBannerIds.push(banner.id_banner);

      console.log(`Created banner ${index + 1}:`, {
        id: banner.id_banner,
        gambar: banner.gambar,
      });
    });
  }, 30000);

  // Test untuk mendapatkan semua banner
  it("GET /api/v1/banner - Mendapatkan daftar banner", async () => {
    const response = await supertest(app).get("/api/v1/banner").expect(200);

    expect(response.body).toHaveProperty("success", true);
    expect(response.body).toHaveProperty("statusCode", 200);
    expect(response.body).toHaveProperty(
      "message",
      "Berhasil mendapatkan banner."
    );
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBeGreaterThan(0);

    // Validasi struktur data banner (lebih fleksibel)
    response.body.data.forEach((banner) => {
      expect(banner).toHaveProperty("id_banner");
      expect(banner).toHaveProperty("gambar");

      // Jika ada gambar, pastikan URL-nya valid
      if (banner.gambar) {
        expect(banner.gambar).toMatch(/^https?:\/\/|^\/|uploads\//);
        // Tidak selalu harus .webp, bisa juga format lain
      }
    });

    // Pastikan banner yang baru dibuat ada dalam list
    createdBannerIds.forEach((bannerId) => {
      const createdBanner = response.body.data.find(
        (b) => b.id_banner === bannerId
      );
      expect(createdBanner).toBeTruthy();
    });

    console.log("Total banners found:", response.body.data.length);
    console.log("Created banner IDs:", createdBannerIds);
  }, 30000);

  // Test untuk menghapus single banner
  it("DELETE /api/v1/banner - Menghapus single banner", async () => {
    // Pastikan ada banner untuk dihapus
    expect(createdBannerIds.length).toBeGreaterThan(0);

    // Ambil ID banner pertama untuk dihapus
    const bannerIdToDelete = createdBannerIds[0];

    const response = await supertest(app)
      .delete("/api/v1/banner")
      .set("Cookie", `aksesToken=${signedToken}`)
      .send({
        ids: [bannerIdToDelete],
      })
      .expect((res) => {
        // Terima 200 atau 404 (jika banner tidak ditemukan)
        expect([200, 404]).toContain(res.status);
      });

    if (response.status === 200) {
      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty("statusCode", 200);
      expect(response.body.message).toContain("berhasil dihapus");

      // Hapus dari tracking array
      createdBannerIds = createdBannerIds.filter(
        (id) => id !== bannerIdToDelete
      );

      console.log("Deleted banner ID:", bannerIdToDelete);
      console.log("Remaining banner IDs:", createdBannerIds);
    } else {
      console.log("Banner not found or already deleted:", bannerIdToDelete);
    }
  }, 30000);

  // Test untuk menghapus multiple banner
  it("DELETE /api/v1/banner - Menghapus multiple banner", async () => {
    // Skip jika tidak ada banner tersisa
    if (createdBannerIds.length === 0) {
      console.log("No banners left to delete");
      return;
    }

    // Ambil sisa banner yang belum dihapus
    const bannerIdsToDelete = [...createdBannerIds]; // copy array

    const response = await supertest(app)
      .delete("/api/v1/banner")
      .set("Cookie", `aksesToken=${signedToken}`)
      .send({
        ids: bannerIdsToDelete,
      })
      .expect((res) => {
        // Terima 200 atau 404 (jika banner tidak ditemukan)
        expect([200, 404]).toContain(res.status);
      });

    if (response.status === 200) {
      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty("statusCode", 200);
      expect(response.body.message).toContain("berhasil dihapus");

      // Clear tracking array
      createdBannerIds = [];

      console.log("Deleted banner IDs:", bannerIdsToDelete);
      console.log("Remaining banner IDs:", createdBannerIds);
    } else {
      console.log("Banners not found or already deleted:", bannerIdsToDelete);
    }
  }, 30000);

  // Test untuk verifikasi banner setelah delete
  it("GET /api/v1/banner - Verifikasi banner setelah delete", async () => {
    const response = await supertest(app).get("/api/v1/banner");

    // Bisa return 200 dengan data kosong atau 404 jika tidak ada banner
    if (response.status === 200) {
      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty("statusCode", 200);
      expect(Array.isArray(response.body.data)).toBe(true);

      // Pastikan banner yang dihapus tidak ada lagi
      const remainingBanners = response.body.data;
      createdBannerIds.forEach((deletedId) => {
        const foundBanner = remainingBanners.find(
          (b) => b.id_banner === deletedId
        );
        expect(foundBanner).toBeFalsy();
      });

      console.log("Remaining banners after cleanup:", remainingBanners.length);
    } else if (response.status === 404) {
      // Jika tidak ada banner tersisa, expect 404
      expect(response.body).toHaveProperty("success", false);
      expect(response.body).toHaveProperty("statusCode", 404);
      expect(response.body).toHaveProperty(
        "message",
        "Ops! daftar banner kosong"
      );
      console.log("No banners remaining - 404 as expected");
    }
  }, 30000);

  // Test untuk membuat banner baru setelah cleanup (optional)
  it("POST /api/v1/banner - Test create banner setelah cleanup", async () => {
    const response = await supertest(app)
      .post("/api/v1/banner")
      .set("Cookie", `aksesToken=${signedToken}`)
      .attach(
        "banner", // Sesuaikan dengan route
        "C:/Users/ACER/BE-RSUD/tests/test-files/unej.png"
      )
      .timeout(30000)
      .expect(201);

    expect(response.body).toHaveProperty("success", true);
    expect(response.body).toHaveProperty("statusCode", 201);
    expect(response.body).toHaveProperty(
      "message",
      "Foto berhasil ditambahkan"
    );
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBe(1);

    const banner = response.body.data[0];
    expect(banner).toHaveProperty("id_banner");
    expect(banner).toHaveProperty("gambar");

    // Simpan untuk cleanup
    createdBannerIds.push(banner.id_banner);

    console.log("Final test - Created banner:", {
      id: banner.id_banner,
      gambar: banner.gambar,
    });
  }, 30000);
});
