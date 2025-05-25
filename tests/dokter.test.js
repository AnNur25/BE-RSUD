const supertest = require("supertest");
const app = require("../app");
const jwt = require("jsonwebtoken");
const cookie = require("cookie-signature");
const { cookieSecret, aksesSecret } = require("../src/configs/env-config");
const path = require("path");
const { test } = require("owasp-password-strength-test");
const prisma = require("../src/prisma/prismaClient");

describe("GET data dokter kosong", () => {
  it("response 404, Data Dokter Kosong", async () => {
    const response = await supertest(app).get("/api/v1/dokter");
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("success", false);
    expect(response.body).toHaveProperty("message", "Data Dokter Kosong");
  });
});
describe("POST menambah data dokter", () => {
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
  it("response 201, created | /api/v1/dokter", async () => {
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
  it("response 400, badrequest | /api/v1/dokter", async () => {
    const response = await supertest(app)
      .post("/api/v1/dokter")
      .set("Cookie", `aksesToken=${signedToken}`)
      .field("nama", " ")
      .field("id_poli", "0b4577fa-437b-4643-850d-5a4be524174b")
      .field("biodata_singkat", " ")
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
  it("response 404, not found Poli | /api/v1/dokter", async () => {
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

describe("GET menampilkan data dokter", () => {
  it("response 200, success | /api/v1/dokter", async () => {
    const response = await supertest(app).get("/api/v1/dokter").expect(200);
    expect(response.body).toHaveProperty("success", true);
    expect(response.body).toHaveProperty("statusCode", 200);
    expect(response.body).toHaveProperty(
      "message",
      "Berhasil menampilkan daftar dokter"
    );
    expect(response.body).toHaveProperty("data");
    expect(response.body.data).toHaveProperty("Dokter");
    expect(response.body.data.Dokter).toBeInstanceOf(Array);

    response.body.data.Dokter.forEach((dokter) => {
      expect(dokter).toHaveProperty("id_dokter");
      expect(dokter).toHaveProperty("nama");
      expect(dokter).toHaveProperty("gambar");
      expect(dokter).toHaveProperty("biodata_singkat");
      expect(dokter).toHaveProperty("link_linkedin");
      expect(dokter).toHaveProperty("link_instagram");
      expect(dokter).toHaveProperty("link_facebook");
      expect(dokter).toHaveProperty("poli");
      expect(dokter.poli).toHaveProperty("id_poli");
      expect(dokter.poli).toHaveProperty("nama_poli");
    });

    expect(response.body.data).toHaveProperty("pagination");
    expect(response.body.data.pagination).toHaveProperty("currentPage");
    expect(response.body.data.pagination).toHaveProperty("pageSize");
    expect(response.body.data.pagination).toHaveProperty("totalItems");
    expect(response.body.data.pagination).toHaveProperty("totalPages");
  });
  it("response 200, success | /api/v1/dokter/search", async () => {
    const response = await supertest(app)
      .get("/api/v1/dokter/search")
      .query({ keyword: "umum", page: 1, pageSize: 10 });
    expect(response.body).toHaveProperty("success", true);
    expect(response.body).toHaveProperty("statusCode", 200);
    expect(response.body).toHaveProperty(
      "message",
      "berhasil menampilkan dokter"
    );
    expect(response.body).toHaveProperty("data");
    expect(response.body.data).toHaveProperty("Dokter");
    expect(response.body.data.Dokter).toBeInstanceOf(Array);

    response.body.data.Dokter.forEach((dokter) => {
      expect(dokter).toHaveProperty("id_dokter");
      expect(dokter).toHaveProperty("nama");
      expect(dokter).toHaveProperty("gambar");
      expect(dokter).toHaveProperty("biodata_singkat");
      expect(dokter).toHaveProperty("link_linkedin");
      expect(dokter).toHaveProperty("link_instagram");
      expect(dokter).toHaveProperty("link_facebook");
      expect(dokter).toHaveProperty("poli");
      expect(dokter.poli).toHaveProperty("id_poli");
      expect(dokter.poli).toHaveProperty("nama_poli");
    });

    expect(response.body.data).toHaveProperty("pagination");
    expect(response.body.data.pagination).toHaveProperty("currentPage");
    expect(response.body.data.pagination).toHaveProperty("pageSize");
    expect(response.body.data.pagination).toHaveProperty("totalItems");
    expect(response.body.data.pagination).toHaveProperty("totalPages");
  });
});
