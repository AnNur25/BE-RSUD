const supertest = require("supertest");
const app = require("../app");
const jwt = require("jsonwebtoken");
const cookie = require("cookie-signature");
const { cookieSecret, aksesSecret } = require("../src/configs/env-config");

describe("POST GET PUT DELETE data pelayanan", () => {
  let signedToken;
  let testPelayananId;
  let testPelayananSlug;

  beforeAll(async () => {
    // Setup yang diperlukan untuk seluruh test suite
  });

  beforeEach(async () => {
    // Generate unique token untuk setiap test
    const payload = {
      id_user: `test_${Date.now()}_${Math.random()}`,
      nama: "Test Admin",
      email: `admin_${Date.now()}@gmail.com`,
      no_wa: "08123456789",
      role: "ADMIN",
    };

    const token = jwt.sign(payload, aksesSecret, { expiresIn: "15m" });
    signedToken = cookie.sign(token, cookieSecret);
  });

  afterEach(async () => {
    // Cleanup data setelah setiap test jika diperlukan
    if (testPelayananId) {
      try {
        await supertest(app)
          .delete(`/api/v1/pelayanan/${testPelayananId}`)
          .set("Cookie", [`aksesToken=${signedToken}`]);
      } catch (error) {
        // Ignore cleanup errors
      }
    }
  });

  // Helper function untuk membuat pelayanan test
  async function createTestPelayanan(customData = {}) {
    const defaultData = {
      nama_pelayanan: `Test Pelayanan ${Date.now()}`,
      Persyaratan: "Test Persyaratan",
      Prosedur: "Test Prosedur",
      JangkaWaktu: "1 Hari",
      Biaya: "A",
    };

    const response = await supertest(app)
      .post("/api/v1/pelayanan")
      .set("Cookie", [`aksesToken=${signedToken}`])
      .send({ ...defaultData, ...customData });

    return response;
  }

  it("response 201, created | POST /api/v1/pelayanan", async () => {
    const response = await createTestPelayanan();

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("success", true);
    expect(response.body).toHaveProperty(
      "message",
      "Layanan berhasil ditambahkan"
    );
    expect(response.body).toHaveProperty("data.id");
    expect(response.body).toHaveProperty("data.nama_pelayanan");
    expect(response.body).toHaveProperty("data.slug");

    // Store untuk cleanup
    testPelayananId = response.body.data.id;
    testPelayananSlug = response.body.data.slug;
  });

  it("response 400, badrequest | POST /api/v1/pelayanan", async () => {
    const response = await supertest(app)
      .post("/api/v1/pelayanan")
      .set("Cookie", [`aksesToken=${signedToken}`])
      .send({
        nama_pelayanan: "",
        Persyaratan: "",
        Prosedur: "",
        JangkaWaktu: "",
        Biaya: "",
      });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("success", false);
    expect(response.body).toHaveProperty("message", "Kolom tidak boleh kosong");
  });

  it("response 200, get all pelayanan | GET /api/v1/pelayanan", async () => {
    const response = await supertest(app).get("/api/v1/pelayanan");

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("success", true);
    expect(response.body).toHaveProperty(
      "message",
      "Berhasil mendapatkan data pelayanan"
    );
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it("response 200, get pelayanan by slug | GET /api/v1/pelayanan/:slug", async () => {
    // Buat pelayanan dulu untuk test ini
    const createResponse = await createTestPelayanan();
    const pelayananSlug = createResponse.body.data.slug;
    testPelayananId = createResponse.body.data.id; // Untuk cleanup

    const response = await supertest(app)
      .get(`/api/v1/pelayanan/${pelayananSlug}`)
      .set("Cookie", [`aksesToken=${signedToken}`]);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("success", true);
    expect(response.body).toHaveProperty("message", "Data pelayanan ditemukan");
    expect(response.body.data).toHaveProperty("id_pelayanan");
    expect(response.body.data).toHaveProperty("nama_pelayanan");
  });

  it("response 200, update pelayanan | PUT /api/v1/pelayanan/:id_pelayanan", async () => {
    // Buat pelayanan dulu untuk test ini
    const createResponse = await createTestPelayanan();
    const pelayananId = createResponse.body.data.id;
    testPelayananId = pelayananId; // Untuk cleanup

    const response = await supertest(app)
      .put(`/api/v1/pelayanan/${pelayananId}`)
      .set("Cookie", [`aksesToken=${signedToken}`])
      .send({
        nama_pelayanan: "Test Pelayanan Updated",
        Persyaratan: "Test Persyaratan Updated",
        Prosedur: "Test Prosedur Updated",
        JangkaWaktu: "2 Hari",
        Biaya: "B",
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("success", true);
    expect(response.body).toHaveProperty(
      "message",
      "Perubahan berhasil disimpan"
    );
    expect(response.body.data).toHaveProperty("id");
    expect(response.body.data).toHaveProperty("nama_pelayanan");
    expect(response.body.data.nama_pelayanan).toBe("Test Pelayanan Updated");
  });

  it("response 400, bad request | PUT /api/v1/pelayanan/:id_pelayanan", async () => {
    // Buat pelayanan dulu untuk test ini
    const createResponse = await createTestPelayanan();
    const pelayananId = createResponse.body.data.id;
    testPelayananId = pelayananId; // Untuk cleanup

    const response = await supertest(app)
      .put(`/api/v1/pelayanan/${pelayananId}`)
      .set("Cookie", [`aksesToken=${signedToken}`])
      .send({
        nama_pelayanan: "",
        Persyaratan: "",
        Prosedur: "",
        JangkaWaktu: "",
        Biaya: "",
      });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("success", false);
    expect(response.body).toHaveProperty("message", "Kolom tidak boleh kosong");
  });

  it("response 404, not found | PUT /api/v1/pelayanan/:id_pelayanan", async () => {
    const response = await supertest(app)
      .put("/api/v1/pelayanan/nonexistent-id")
      .set("Cookie", [`aksesToken=${signedToken}`])
      .send({
        nama_pelayanan: "Test Pelayanan",
        Persyaratan: "Test Persyaratan",
        Prosedur: "Test Prosedur",
        JangkaWaktu: "1 Hari",
        Biaya: "B",
      });

    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty("success", false);
    expect(response.body).toHaveProperty(
      "message",
      "Pelayanan dengan ID nonexistent-id tidak ditemukan"
    );
  });

  // Optional: Test untuk DELETE jika ada endpoint
  it("response 200, delete pelayanan | DELETE /api/v1/pelayanan/:id_pelayanan", async () => {
    // Buat pelayanan dulu untuk test ini
    const createResponse = await createTestPelayanan();
    const pelayananId = createResponse.body.data.id;

    const response = await supertest(app)
      .delete(`/api/v1/pelayanan/${pelayananId}`)
      .set("Cookie", [`aksesToken=${signedToken}`]);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("success", true);
    // Tidak perlu cleanup karena sudah dihapus
    testPelayananId = null;
  });
});

// Alternatif: Menggunakan describe nested untuk test yang bergantung
describe("POST GET PUT DELETE data pelayanan - Alternative Structure", () => {
  let signedToken;

  beforeEach(async () => {
    const payload = {
      id_user: `test_${Date.now()}_${Math.random()}`,
      nama: "Test Admin",
      email: `admin_${Date.now()}@gmail.com`,
      no_wa: "08123456789",
      role: "ADMIN",
    };

    const token = jwt.sign(payload, aksesSecret, { expiresIn: "15m" });
    signedToken = cookie.sign(token, cookieSecret);
  });

  describe("Independent Tests", () => {
    it("response 201, created | POST /api/v1/pelayanan", async () => {
      // Test independen
    });

    it("response 400, badrequest | POST /api/v1/pelayanan", async () => {
      // Test independen
    });

    it("response 200, get all pelayanan | GET /api/v1/pelayanan", async () => {
      // Test independen
    });
  });

  describe("Dependent Tests - CRUD Flow", () => {
    let pelayananId;
    let pelayananSlug;

    beforeAll(async () => {
      // Setup data untuk semua test dalam grup ini
      const response = await supertest(app)
        .post("/api/v1/pelayanan")
        .set("Cookie", [`aksesToken=${signedToken}`])
        .send({
          nama_pelayanan: "Test Pelayanan for CRUD",
          Persyaratan: "Test Persyaratan",
          Prosedur: "Test Prosedur",
          JangkaWaktu: "1 Hari",
          Biaya: "A",
        });

      pelayananId = response.body.data.id;
      pelayananSlug = response.body.data.slug;
    });

    afterAll(async () => {
      // Cleanup setelah semua test dalam grup ini
      if (pelayananId) {
        try {
          await supertest(app)
            .delete(`/api/v1/pelayanan/${pelayananId}`)
            .set("Cookie", [`aksesToken=${signedToken}`]);
        } catch (error) {
          // Ignore cleanup errors
        }
      }
    });

    it("response 200, get pelayanan by slug | GET /api/v1/pelayanan/:slug", async () => {
      // Test menggunakan data yang sudah dibuat
    });

    it("response 200, update pelayanan | PUT /api/v1/pelayanan/:id_pelayanan", async () => {
      // Test menggunakan data yang sudah dibuat
    });
  });
});
