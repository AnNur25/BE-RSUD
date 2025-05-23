// test/poli.test.js
const request = require("supertest");
const app = require("../app"); // Import app Express Anda
const jwt = require("jsonwebtoken");
const cookie = require("cookie-signature");
const { cookieSecret, aksesSecret } = require("../src/configs/env-config");

describe("POST /api/v1/poli", () => {
  let signedToken;

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

  it("should create poli umum successfully", async () => {
    const poliData = {
      nama_poli: "umum",
    };

    const response = await request(app)
      .post("/api/v1/poli")
      .set("Cookie", `aksesToken=${signedToken}`)
      .send(poliData)
      .expect(201);

    expect(response.body).toHaveProperty("success", true);
    expect(response.body).toHaveProperty("statusCode", 201);
    expect(response.body).toHaveProperty(
      "message",
      "Poli berhasil ditambahkan"
    );
    expect(response.body.data).toHaveProperty("id_poli");
    expect(response.body.data).toHaveProperty("nama_poli", "Poli Umum");
  });
});
