const supertest = require("supertest");
const jwt = require("jsonwebtoken");
const cookie = require("cookie-signature");
const app = require("../app");
const { aksesSecret, cookieSecret } = require("../src/configs/env-config");

describe("SUKSES: test endpoint poli dengan autentikasi", () => {
  test("POST /api/v1/poli - Success with valid token", async () => {
    const payload = {
      nama_poli: "Umum",
    };
    const userPayload = {
      id: "stringid",
      role: "ADMIN",
      nama: "Admin Baru",
      email: "adminbaru@gmail.com",
    };

    const token = jwt.sign(userPayload, aksesSecret);

    // Coba format cookie sederhana dulu (tanpa signature)
    let response = await supertest(app)
      .post("/api/v1/poli")
      .set("Cookie", `aksesToken=${token}`)
      .send(payload);

    // Jika gagal, coba dengan signed cookie
    if (response.status !== 201) {
      const signedToken = cookie.sign(token, cookieSecret);
      response = await supertest(app)
        .post("/api/v1/poli")
        .set("Cookie", `aksesToken=s%3A${encodeURIComponent(signedToken)}`)
        .send(payload);
    }

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Poli berhasil ditambahkan");
    expect(response.body.data).toHaveProperty("nama_poli", "Umum");
  });
});
