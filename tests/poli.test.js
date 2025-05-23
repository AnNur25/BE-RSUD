const supertest = require("supertest");
const app = require("../app");
const jwt = require("jsonwebtoken");
const cookie = require("cookie-signature");
const { cookieSecret, aksesSecret } = require("../src/configs/env-config");

describe("SUKSES: test endpoint CRUD Poli", () => {
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

  it("POST /api/v1/poli", async () => {
    const poliData = {
      nama_poli: "umum",
    };

    const response = await supertest(app)
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

  it("GET /api/v1/poli", async () => {
    const response = await supertest(app).get("/api/v1/poli").expect(200);

    expect(response.body).toHaveProperty("success", true);
    expect(response.body).toHaveProperty("statusCode", 200);
    expect(response.body).toHaveProperty(
      "message",
      "Berhasil menampilkan Daftar Poli"
    );
    expect(
      response.body.data.every((item) => item.hasOwnProperty("id_poli"))
    ).toBe(true);

    expect(
      response.body.data.every((item) => item.hasOwnProperty("nama_poli"))
    ).toBe(true);
  });
  it("GET /api/v1/poli/:id", async () => {
    const response = await supertest(app)
      .get("/api/v1/poli/f4b34b36-b702-4294-9cf1-476eb5a57e1e")
      .expect(200);

    expect(response.body).toHaveProperty("success", true);
    expect(response.body).toHaveProperty("statusCode", 200);
    expect(response.body).toHaveProperty(
      "message",
      "Berhasil mengambil id poli"
    );
    expect(response.body.data).toHaveProperty("id_poli");
    expect(response.body.data).toHaveProperty("nama_poli");
  });
  it("GET /api/v1/poli/:id/dokter", async () => {
    const response = await supertest(app)
      .get("/api/v1/poli/95d1f57c-01cf-49f3-bb6c-32a5dba8f300/dokter")
      .set("Cookie", `aksesToken=${signedToken}`)
      .expect(200);

    expect(response.body).toHaveProperty("success", true);
    expect(response.body).toHaveProperty("statusCode", 200);
    expect(response.body).toHaveProperty(
      "message",
      "Berhasil menampilkan daftar dokter berdasarkan poli"
    );
    expect(
      response.body.data.every((item) => item.hasOwnProperty("id_dokter"))
    ).toBe(true);

    expect(
      response.body.data.every((item) => item.hasOwnProperty("nama"))
    ).toBe(true);
  });
  it("PUT /api/v1/poli/:id", async () => {
    const poliData = {
      nama_poli: "bedah",
    };

    const response = await supertest(app)
      .put("/api/v1/poli/f4b34b36-b702-4294-9cf1-476eb5a57e1e")
      .set("Cookie", `aksesToken=${signedToken}`)
      .send(poliData)
      .expect(200);

    expect(typeof response.body.data).toBe("string");
    expect(response.body).toHaveProperty("success", true);
    expect(response.body).toHaveProperty("statusCode", 200);
    expect(response.body).toHaveProperty(
      "message",
      "perubahan berhasil disimpan"
    );

    expect(response.body.data).toBe("Poli Spesialis Bedah");
  });
});
