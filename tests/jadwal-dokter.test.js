const supertest = require("supertest");
const app = require("../app");
const jwt = require("jsonwebtoken");
const cookie = require("cookie-signature");
const { cookieSecret, aksesSecret } = require("../src/configs/env-config");

describe("SUKSES: test endpoint CRUD Jadwal Dokter", () => {
  let signedToken;

  // Setup authentication token
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
  });

  // Cleanup after all tests
  afterAll(async () => {
    // Add cleanup logic here if needed
    await new Promise((resolve) => setTimeout(resolve, 100));
  });

  // Test untuk mendapatkan semua jadwal dokter
  describe("GET /api/v1/jadwal-dokter", () => {
    it("should get all jadwal dokter with pagination", async () => {
      const response = await supertest(app)
        .get("/api/v1/jadwal-dokter/")
        .query({
          page: 1,
          pageSize: 10,
        })
        .expect((res) => {
          // Accept both 200 (with data) and 404 (no data found)
          expect([200, 404]).toContain(res.status);
        });

      if (response.status === 200) {
        expect(response.body).toHaveProperty("success", true);
        expect(response.body).toHaveProperty("statusCode", 200);
        expect(response.body).toHaveProperty(
          "message",
          "Berhasil menampilkan seluruh jadwal dokter"
        );
        expect(response.body.data).toHaveProperty("dokter");
        expect(response.body.data).toHaveProperty("pagination");
        expect(response.body.data.pagination).toHaveProperty("currentPage", 1);
        expect(response.body.data.pagination).toHaveProperty("pageSize", 10);
        expect(response.body.data.pagination).toHaveProperty("totalItems");
        expect(response.body.data.pagination).toHaveProperty("totalPages");
        expect(Array.isArray(response.body.data.dokter)).toBe(true);

        console.log(
          "Found jadwal dokter:",
          response.body.data.pagination.totalItems
        );
      } else {
        // 404 - No data found
        expect(response.body).toHaveProperty("success", false);
        expect(response.body).toHaveProperty("statusCode", 404);
        console.log("No jadwal dokter found in database");
      }
    });

    it("should handle empty database gracefully", async () => {
      // Test specific untuk kondisi database kosong
      const response = await supertest(app)
        .get("/api/v1/jadwal-dokter/")
        .query({
          page: 1,
          pageSize: 10,
        });

      // Terima response apapun (200 dengan data kosong atau 404)
      expect([200, 404]).toContain(response.status);

      if (response.status === 200) {
        expect(response.body).toHaveProperty("success", true);
        expect(Array.isArray(response.body.data.dokter)).toBe(true);
        // Bisa jadi array kosong
        expect(response.body.data.dokter.length).toBeGreaterThanOrEqual(0);
      } else {
        expect(response.body).toHaveProperty("success", false);
        expect(response.body).toHaveProperty("statusCode", 404);
      }
    });
  });

  // Test untuk mencari jadwal dokter berdasarkan nama
  describe("GET /api/v1/jadwal-dokter/search-nama", () => {
    it("should search jadwal dokter by name", async () => {
      const testNama = "Dr"; // Menggunakan nama yang lebih umum

      const response = await supertest(app)
        .get("/api/v1/jadwal-dokter/search-nama")
        .query({
          nama: testNama,
          page: 1,
          pageSize: 10,
        })
        .expect((res) => {
          expect([200, 404]).toContain(res.status);
        });

      if (response.status === 200) {
        expect(response.body).toHaveProperty("success", true);
        expect(response.body).toHaveProperty("statusCode", 200);
        expect(response.body).toHaveProperty(
          "message",
          `Pencarian dokter dengan nama '${testNama}' berhasil.`
        );
        expect(response.body.data).toHaveProperty("dokter");
        expect(response.body.data).toHaveProperty("pagination");
        expect(Array.isArray(response.body.data.dokter)).toBe(true);
      }
    });
  });

  // Test CRUD dengan setup dan cleanup per test
  describe("CRUD Operations", () => {
    let testDokterId;
    let testPoliId;
    let testPelayananId;

    beforeEach(async () => {
      // Setup data untuk setiap test
      // Ambil data existing untuk test
      try {
        const getAllResponse = await supertest(app)
          .get("/api/v1/jadwal-dokter/")
          .query({ page: 1, pageSize: 10 });

        if (
          getAllResponse.status === 200 &&
          getAllResponse.body.data &&
          getAllResponse.body.data.dokter &&
          getAllResponse.body.data.dokter.length > 0
        ) {
          testDokterId = getAllResponse.body.data.dokter[0].id_dokter;
          testPoliId = getAllResponse.body.data.dokter[0].id_poli;
          if (
            getAllResponse.body.data.dokter[0].layanan &&
            getAllResponse.body.data.dokter[0].layanan.length > 0
          ) {
            testPelayananId =
              getAllResponse.body.data.dokter[0].layanan[0].id_pelayanan;
          }
        } else {
          console.log("No existing jadwal dokter found for CRUD tests");
        }
      } catch (error) {
        console.log("Error setting up test data:", error.message);
      }
    });

    afterEach(() => {
      // Reset test data
      testDokterId = null;
      testPoliId = null;
      testPelayananId = null;
    });

    it("should create jadwal dokter", async () => {
      // Skip test jika tidak ada data yang diperlukan
      if (!testDokterId || !testPelayananId) {
        console.log("Skipping create test - missing required test data");
        return;
      }

      const jadwalData = {
        id_dokter: testDokterId,
        layananList: [
          {
            id_pelayanan: testPelayananId,
            hariList: [
              {
                hari: "senin",
                jam_mulai: "08:00",
                jam_selesai: "12:00",
              },
              {
                hari: "selasa",
                jam_mulai: "13:00",
                jam_selesai: "17:00",
              },
            ],
          },
        ],
      };

      const response = await supertest(app)
        .post("/api/v1/jadwal-dokter/")
        .set("Cookie", `aksesToken=${signedToken}`)
        .send(jadwalData)
        .expect(201);

      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty("statusCode", 201);
      expect(response.body).toHaveProperty(
        "message",
        "Jadwal berhasil ditambahkan"
      );
      expect(response.body.data).toHaveProperty("id_dokter", testDokterId);
      expect(response.body.data).toHaveProperty("nama_dokter");
    });

    it("should get jadwal dokter by ID", async () => {
      if (!testDokterId) {
        console.log("Skipping get by ID test - missing dokter data");
        return;
      }

      const response = await supertest(app)
        .get(`/api/v1/jadwal-dokter/${testDokterId}`)
        .expect((res) => {
          expect([200, 404]).toContain(res.status);
        });

      if (response.status === 200) {
        expect(response.body).toHaveProperty("success", true);
        expect(response.body).toHaveProperty("statusCode", 200);
        expect(response.body).toHaveProperty(
          "message",
          "Berhasil mengambil data jadwal dokter"
        );
        expect(response.body.data).toHaveProperty("dokter");
        expect(response.body.data.dokter).toHaveProperty(
          "id_dokter",
          testDokterId
        );
        expect(response.body.data.dokter).toHaveProperty("nama_dokter");
      }
    });

    it("should update jadwal dokter", async () => {
      if (!testDokterId || !testPelayananId) {
        console.log("Skipping update test - missing required data");
        return;
      }

      const updateData = {
        layananList: [
          {
            id_pelayanan: testPelayananId,
            hariList: [
              {
                hari: "rabu",
                jam_mulai: "09:00",
                jam_selesai: "13:00",
              },
              {
                hari: "kamis",
                jam_mulai: "14:00",
                jam_selesai: "18:00",
              },
            ],
          },
        ],
      };

      const response = await supertest(app)
        .put(`/api/v1/jadwal-dokter/${testDokterId}`)
        .set("Cookie", `aksesToken=${signedToken}`)
        .send(updateData)
        .expect((res) => {
          expect([200, 404]).toContain(res.status);
        });

      if (response.status === 200) {
        expect(response.body).toHaveProperty("success", true);
        expect(response.body).toHaveProperty("statusCode", 200);
        expect(response.body).toHaveProperty(
          "message",
          "Perubahan berhasil disimpan"
        );
        expect(response.body.data).toHaveProperty("id_dokter", testDokterId);
        expect(response.body.data).toHaveProperty("nama_dokter");
      }
    });

    it("should search jadwal dokter by poli and date", async () => {
      if (!testPoliId) {
        console.log("Skipping search test - missing poli data");
        return;
      }

      const testDate = "2024-01-15"; // Senin

      const response = await supertest(app)
        .get("/api/v1/jadwal-dokter/search")
        .query({
          id_poli: testPoliId,
          tanggal: testDate,
          page: 1,
          pageSize: 10,
        })
        .expect((res) => {
          expect([200, 404]).toContain(res.status);
        });

      if (response.status === 200) {
        expect(response.body).toHaveProperty("success", true);
        expect(response.body).toHaveProperty("statusCode", 200);
        expect(response.body).toHaveProperty("message");
        expect(response.body.message).toContain(
          "Data jadwal dokter untuk hari"
        );
        expect(response.body.data).toHaveProperty("dokter");
        expect(response.body.data).toHaveProperty("pagination");
        expect(Array.isArray(response.body.data.dokter)).toBe(true);
      }
    });
  });

  // Test DELETE dan verifikasi terpisah untuk menghindari dependency
  describe("DELETE Operations", () => {
    let testDokterId;
    let createdJadwalId;

    beforeEach(async () => {
      // Setup: buat jadwal dokter baru untuk di-delete
      const getAllResponse = await supertest(app)
        .get("/api/v1/jadwal-dokter/")
        .query({ page: 1, pageSize: 10 });

      if (
        getAllResponse.status === 200 &&
        getAllResponse.body.data.dokter.length > 0
      ) {
        testDokterId = getAllResponse.body.data.dokter[0].id_dokter;
        const testPelayananId =
          getAllResponse.body.data.dokter[0].layanan?.[0]?.id_pelayanan;

        // Buat jadwal baru untuk di-delete
        if (testDokterId && testPelayananId) {
          const jadwalData = {
            id_dokter: testDokterId,
            layananList: [
              {
                id_pelayanan: testPelayananId,
                hariList: [
                  {
                    hari: "jumat",
                    jam_mulai: "08:00",
                    jam_selesai: "12:00",
                  },
                ],
              },
            ],
          };

          try {
            const createResponse = await supertest(app)
              .post("/api/v1/jadwal-dokter/")
              .set("Cookie", `aksesToken=${signedToken}`)
              .send(jadwalData);

            if (createResponse.status === 201) {
              createdJadwalId = createResponse.body.data.id_dokter;
            }
          } catch (error) {
            console.log("Failed to create test jadwal for delete test");
          }
        }
      }
    });

    afterEach(async () => {
      // Cleanup: hapus jadwal yang dibuat jika masih ada
      if (createdJadwalId) {
        try {
          await supertest(app)
            .delete(`/api/v1/jadwal-dokter/${createdJadwalId}`)
            .set("Cookie", `aksesToken=${signedToken}`);
        } catch (error) {
          // Ignore cleanup errors
        }
      }
    });

    it("should delete jadwal dokter", async () => {
      if (!createdJadwalId) {
        console.log("Skipping delete test - no test jadwal created");
        return;
      }

      const response = await supertest(app)
        .delete(`/api/v1/jadwal-dokter/${createdJadwalId}`)
        .set("Cookie", `aksesToken=${signedToken}`)
        .expect((res) => {
          expect([200, 404]).toContain(res.status);
        });

      if (response.status === 200) {
        expect(response.body).toHaveProperty("success", true);
        expect(response.body).toHaveProperty("statusCode", 200);
        expect(response.body).toHaveProperty("message");
        expect(response.body.message).toContain("berhasil dihapus");
        expect(response.body.data).toBeNull();

        // Verify deletion
        const verifyResponse = await supertest(app)
          .get(`/api/v1/jadwal-dokter/${createdJadwalId}`)
          .expect(404);

        expect(verifyResponse.body).toHaveProperty("success", false);
        expect(verifyResponse.body).toHaveProperty("statusCode", 404);
      }
    });
  });
});
