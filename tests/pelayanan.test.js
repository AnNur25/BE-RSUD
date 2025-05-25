const supertest = require("supertest");
const app = require("../app");
const jwt = require("jsonwebtoken");
const cookie = require("cookie-signature");
const { cookieSecret, aksesSecret } = require("../src/configs/env-config");

describe("POST PUT DELETE data pelayanan", () => {
  let signedToken;
  let createPelayananId;

  beforeEach(() => {
    const payload = {
      id_user: "okoko",
      nama: "Test Admin",
      email: "admin@gmail.com",
      no_wa: "08123456789",
      role: "ADMIN",
    };

    const token = jwt.sign(payload, aksesSecret, { expiresIn: "15m" });
    signedToken = cookie.sign(token, cookieSecret);
  });
  it("response 201, created | POST /api/v1/pelayanan", async () => {
    const response = await supertest(app)
      .post("/api/v1/pelayanan")
      .set("Cookie", [`aksesToken=${signedToken}`])
      .send({
        nama_pelayanan: "Test Pelayanan",
        Persyaratan: "Test Persyaratan",
        Prosedur: "Test Prosedur",
        JangkaWaktu: "1 Hari",
        Biaya: 10000,
      });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("success", true);
    expect(response.body).toHaveProperty(
      "message",
      "Pelayanan berhasil ditambahkan"
    );
    expect(response.body).toHaveProperty("data.id");
    expect(response.body).toHaveProperty("data.nama_pelayanan");
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
    expect(response.body).toHaveProperty(
      "message",
      "Semua field wajib diisi"
    );
  });
});
