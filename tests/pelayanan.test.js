// const supertest = require("supertest");
// const app = require("../app");
// const jwt = require("jsonwebtoken");
// const cookie = require("cookie-signature");
// const { cookieSecret, aksesSecret } = require("../src/configs/env-config");

// describe("POST GET PUT DELETE data pelayanan", () => {
//   let signedToken;
//   let createPelayananId;
//   let createPelayananSlug;

//   beforeEach(() => {
//     const payload = {
//       id_user: "okoko",
//       nama: "Test Admin",
//       email: "admin@gmail.com",
//       no_wa: "08123456789",
//       role: "ADMIN",
//     };

//     const token = jwt.sign(payload, aksesSecret, { expiresIn: "15m" });
//     signedToken = cookie.sign(token, cookieSecret);
//   });
//   it("response 201, created | POST /api/v1/pelayanan", async () => {
//     const response = await supertest(app)
//       .post("/api/v1/pelayanan")
//       .set("Cookie", [`aksesToken=${signedToken}`])
//       .send({
//         nama_pelayanan: "Test Pelayanan",
//         Persyaratan: "Test Persyaratan",
//         Prosedur: "Test Prosedur",
//         JangkaWaktu: "1 Hari",
//         Biaya: "A",
//       });

//     expect(response.statusCode).toBe(201);
//     expect(response.body).toHaveProperty("success", true);
//     expect(response.body).toHaveProperty(
//       "message",
//       "Layanan berhasil ditambahkan"
//     );
//     expect(response.body).toHaveProperty("data.id");
//     expect(response.body).toHaveProperty("data.nama_pelayanan");
//     expect(response.body).toHaveProperty("data.slug");
//     createPelayananId = response.body.data.id;
//     createPelayananSlug = response.body.data.slug;
//   });
//   it("response 400, badrequest | POST /api/v1/pelayanan", async () => {
//     const response = await supertest(app)
//       .post("/api/v1/pelayanan")
//       .set("Cookie", [`aksesToken=${signedToken}`])
//       .send({
//         nama_pelayanan: "",
//         Persyaratan: "",
//         Prosedur: "",
//         JangkaWaktu: "",
//         Biaya: "",
//       });

//     expect(response.statusCode).toBe(400);
//     expect(response.body).toHaveProperty("success", false);
//     expect(response.body).toHaveProperty("message", "Kolom tidak boleh kosong");
//   });
//   it("response 200, get all pelayanan | GET /api/v1/pelayanan", async () => {
//     const response = await supertest(app).get("/api/v1/pelayanan");

//     expect(response.statusCode).toBe(200);
//     expect(response.body).toHaveProperty("success", true);
//     expect(response.body).toHaveProperty(
//       "message",
//       "Berhasil mendapatkan data pelayanan"
//     );
//     expect(Array.isArray(response.body.data)).toBe(true);
//   });
//   it("response 200, get pelayanan by id | GET /api/v1/pelayanan/:slug", async () => {
//     const response = await supertest(app)
//       .get(`/api/v1/pelayanan/${createPelayananSlug}`)
//       .set("Cookie", [`aksesToken=${signedToken}`]);

//     expect(response.statusCode).toBe(200);
//     expect(response.body).toHaveProperty("success", true);
//     expect(response.body).toHaveProperty("message", "Data pelayanan ditemukan");
//     expect(response.body.data).toHaveProperty("id_pelayanan");
//     expect(response.body.data).toHaveProperty("nama_pelayanan");
//   });

//   it("response 200, update pelayanan | PUT /api/v1/pelayanan/:id_pelayanan", async () => {
//     const response = await supertest(app)
//       .put(`/api/v1/pelayanan/${createPelayananId}`)
//       .set("Cookie", [`aksesToken=${signedToken}`])
//       .send({
//         nama_pelayanan: "Test Pelayanan",
//         Persyaratan: "Test Persyaratan",
//         Prosedur: "Test Prosedur",
//         JangkaWaktu: "1 Hari",
//         Biaya: "A",
//       });
//     expect(response.statusCode).toBe(200);
//     expect(response.body).toHaveProperty("success", true);
//     expect(response.body).toHaveProperty(
//       "message",
//       "Perubahan berhasil disimpan"
//     );
//     expect(response.body.data).toHaveProperty("id");
//     expect(response.body.data).toHaveProperty("nama_pelayanan");
//     expect(response.body.data.nama_pelayanan).toBe("Test Pelayanan");
//   });
//   it("response 400, bad request | PUT /api/v1/pelayanan/:id_pelayanan", async () => {
//     const response = await supertest(app)
//       .put(`/api/v1/pelayanan/${createPelayananId}`)
//       .set("Cookie", [`aksesToken=${signedToken}`])
//       .send({
//         nama_pelayanan: "",
//         Persyaratan: "",
//         Prosedur: "",
//         JangkaWaktu: "",
//         Biaya: "",
//       });

//     expect(response.statusCode).toBe(400);
//     expect(response.body).toHaveProperty("success", false);
//     expect(response.body).toHaveProperty("message", "Kolom tidak boleh kosong");
//   });
//   it("response 404, not found | PUT /api/v1/pelayanan/:id_pelayanan", async () => {
//     const response = await supertest(app)
//       .put("/api/v1/pelayanan/pelayanan")
//       .set("Cookie", [`aksesToken=${signedToken}`])
//       .send({
//         nama_pelayanan: "Test Pelayanan",
//         Persyaratan: "Test Persyaratan",
//         Prosedur: "Test Prosedur",
//         JangkaWaktu: "1 Hari",
//         Biaya: "B",
//       });

//     expect(response.statusCode).toBe(404);
//     expect(response.body).toHaveProperty("success", false);
//     expect(response.body).toHaveProperty(
//       "message",
//       "Pelayanan dengan ID pelayanan tidak ditemukan"
//     );
//   });
// });
