const supertest = require("supertest");
const app = require("../app");
const jwt = require("jsonwebtoken");
const cookie = require("cookie-signature");
const { cookieSecret, aksesSecret } = require("../src/configs/env-config");
const path = require("path");

describe("POST /api/v1/dokter", () => {
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
  it("response 201, created", async () => {
    const response = await supertest(app)
      .post("/api/v1/dokter")
      .set("Cookie", `aksesToken=${signedToken}`)
      .field("nama", "Dr. ChatGPT")
      .field("id_poli", "0b4577fa-437b-4643-850d-5a4be524174b")
      .field("biodata_singkat", "Ahli AI dan Kecerdasan Buatan")
      .field("link_linkedin", "https://linkedin.com/in/chatgpt")
      .field("link_instagram", "https://instagram.com/chatgpt")
      .field("link_facebook", "https://facebook.com/chatgpt")
      .attach("file", "C:/Users/ACER/BE-RSUD/tests/test-files/code.png");

    console.log("Response body:", response.body);

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("success", true);
    expect(response.body).toHaveProperty(
      "message",
      "Dokter berhasil ditambahkan"
    );
    expect(response.body).toHaveProperty("data.id");
    expect(response.body).toHaveProperty("data.nama", "Dr. ChatGPT");
  });
  it("response 400, badrequest", async () => {
    const response = await supertest(app)
      .post("/api/v1/dokter")
      .set("Cookie", `aksesToken=${signedToken}`)
      .field("nama", " ") // Kosong atau hanya spasi
      .field("id_poli", "0b4577fa-437b-4643-850d-5a4be524174b") // ID poli yang valid
      .field("biodata_singkat", " ") // Kosong atau hanya spasi
      .field("link_linkedin", "https://linkedin.com/in/chatgpt")
      .field("link_instagram", "https://instagram.com/chatgpt")
      .field("link_facebook", "https://facebook.com/chatgpt");

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("success", false);
    expect(response.body).toHaveProperty(
      "message",
      "Nama, Poli, dan Biodata singkat harus diisi"
    );
  });
  it("response 404, not found Poli", async () => {
    const response = await supertest(app)
      .post("/api/v1/dokter")
      .set("Cookie", `aksesToken=${signedToken}`)
      .field("nama", "admin 1")
      .field("id_poli", "not-poli-id")
      .field("biodata_singkat", "bio admin singkat ")
      .field("link_linkedin", "https://linkedin.com/in/chatgpt")
      .field("link_instagram", "https://instagram.com/chatgpt")
      .field("link_facebook", "https://facebook.com/chatgpt")
      .attach("file", "C:/Users/ACER/BE-RSUD/tests/test-files/code.png");

    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty("success", false);
    expect(response.body).toHaveProperty("message", "Poli tidak ditemukan");
  });
});
