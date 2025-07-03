const supertest = require("supertest");
const app = require("../app");
const jwt = require("jsonwebtoken");
const cookie = require("cookie-signature");
const { cookieSecret, aksesSecret } = require("../src/configs/env-config");

describe("GET PUT data media sosial", () => {
  let signedToken;

  // Setup sebelum semua test
  beforeAll(async () => {
    // Setup database atau mock jika perlu
    // await setupTestDatabase();
  });

  // Cleanup setelah semua test
  afterAll(async () => {
    // Cleanup database
    // await cleanupTestDatabase();
  });

  beforeEach(async () => {
    const payload = {
      id_user: `test_${Date.now()}_${Math.random()}`, // Unique ID
      nama: "Test Admin",
      email: `admin_${Date.now()}@gmail.com`, // Unique email
      no_wa: "08123456789",
      role: "ADMIN",
    };

    const token = jwt.sign(payload, aksesSecret, { expiresIn: "15m" });
    signedToken = cookie.sign(token, cookieSecret);

    // Reset state atau cleanup data sebelum setiap test
    // await resetMediaSosialData();
  });

  afterEach(async () => {
    // Cleanup setelah setiap test
    // await cleanupMediaSosialData();
  });

  it("response 200, get all media sosial | GET /api/v1/media-sosial", async () => {
    const response = await supertest(app).get("/api/v1/media-sosial");

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("success", true);
    expect(response.body).toHaveProperty(
      "message",
      "Media sosial berhasil diperbarui"
    );
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it("response 200, update media sosial dengan 1 link | PUT /api/v1/media-sosial", async () => {
    const response = await supertest(app)
      .put("/api/v1/media-sosial")
      .set("Cookie", [`aksesToken=${signedToken}`])
      .send({
        links: ["https://www.instagram.com/p/test1/"],
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("success", true);
    expect(response.body).toHaveProperty("message", "berhasil memperbarui");
  });

  it("response 200, update media sosial dengan 4 link | PUT /api/v1/media-sosial", async () => {
    const response = await supertest(app)
      .put("/api/v1/media-sosial")
      .set("Cookie", [`aksesToken=${signedToken}`])
      .send({
        links: [
          "https://www.instagram.com/p/test1/",
          "https://www.instagram.com/p/test2/",
          "https://www.instagram.com/p/test3/",
          "https://www.instagram.com/p/test4/",
        ],
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("success", true);
    expect(response.body).toHaveProperty("message", "berhasil memperbarui");
  });

  it("response 400, bad request - links bukan array | PUT /api/v1/media-sosial", async () => {
    const response = await supertest(app)
      .put("/api/v1/media-sosial")
      .set("Cookie", [`aksesToken=${signedToken}`])
      .send({
        links: "https://www.instagram.com/p/test1/",
      });

    expect(response.statusCode).toBeGreaterThanOrEqual(400);
    expect(response.body).toHaveProperty("success", false);
    expect(response.body).toHaveProperty("message");
  });

  it("response 400, bad request - tidak mengirim links | PUT /api/v1/media-sosial", async () => {
    const response = await supertest(app)
      .put("/api/v1/media-sosial")
      .set("Cookie", [`aksesToken=${signedToken}`])
      .send({});

    expect(response.statusCode).toBeGreaterThanOrEqual(400);
    expect(response.body).toHaveProperty("success", false);
    expect(response.body).toHaveProperty("message");
  });

  it("response 400, bad request - link tidak valid | PUT /api/v1/media-sosial", async () => {
    const response = await supertest(app)
      .put("/api/v1/media-sosial")
      .set("Cookie", [`aksesToken=${signedToken}`])
      .send({
        links: [
          "https://www.facebook.com/test/",
          "https://www.instagram.com/p/test2/",
        ],
      });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("success", false);
    expect(response.body).toHaveProperty("message", "link tidak valid");
  });

  it("response 400, bad request - link kosong | PUT /api/v1/media-sosial", async () => {
    const response = await supertest(app)
      .put("/api/v1/media-sosial")
      .set("Cookie", [`aksesToken=${signedToken}`])
      .send({
        links: ["", "https://www.instagram.com/p/test2/"],
      });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("success", false);
    expect(response.body).toHaveProperty("message", "link tidak valid");
  });

  it("response 400, bad request - maksimal 4 link | PUT /api/v1/media-sosial", async () => {
    const response = await supertest(app)
      .put("/api/v1/media-sosial")
      .set("Cookie", [`aksesToken=${signedToken}`])
      .send({
        links: [
          "https://www.instagram.com/p/test1/",
          "https://www.instagram.com/p/test2/",
          "https://www.instagram.com/p/test3/",
          "https://www.instagram.com/p/test4/",
          "https://www.instagram.com/p/test5/",
        ],
      });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("success", false);
    expect(response.body).toHaveProperty(
      "message",
      "Maksimal 4 link yang diperbolehkan"
    );
  });

  it("response 200, update media sosial dengan array kosong | PUT /api/v1/media-sosial", async () => {
    const response = await supertest(app)
      .put("/api/v1/media-sosial")
      .set("Cookie", [`aksesToken=${signedToken}`])
      .send({
        links: [],
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("success", true);
    expect(response.body).toHaveProperty("message", "berhasil memperbarui");
  });
});

// Helper functions untuk cleanup (sesuaikan dengan database/storage Anda)
async function setupTestDatabase() {
  // Setup database test
}

async function cleanupTestDatabase() {
  // Cleanup database test
}

async function resetMediaSosialData() {
  // Reset data media sosial sebelum test
}

async function cleanupMediaSosialData() {
  // Cleanup data media sosial setelah test
}
