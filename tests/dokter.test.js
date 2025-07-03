// const supertest = require("supertest");
// const app = require("../app");
// const jwt = require("jsonwebtoken");
// const cookie = require("cookie-signature");
// const { cookieSecret, aksesSecret } = require("../src/configs/env-config");

// describe("GET data dokter kosong", () => {
//   it("response 404, Data Dokter Kosong", async () => {
//     const response = await supertest(app).get("/api/v1/dokter");
//     expect(response.status).toBe(404);
//     expect(response.body).toHaveProperty("success", false);
//     expect(response.body).toHaveProperty("message", "Data Dokter Kosong");
//   });
// });
// describe("SUKSES: POST PUT DELETE data dokter", () => {
//   let signedToken;

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
//   let createdDokterSlug;
//   let createdDokterId;

//   it("response 201, created | POST /api/v1/dokter", async () => {
//     const response = await supertest(app)
//       .post("/api/v1/dokter")
//       .set("Cookie", `aksesToken=${signedToken}`)
//       .field("nama", "Dr. ChatGPT")
//       .field("id_poli", "0b4577fa-437b-4643-850d-5a4be524174b")
//       .field("biodata_singkat", "Ahli AI dan Kecerdasan Buatan")
//       .field("link_linkedin", "https://linkedin.com/in/chatgpt")
//       .field("link_instagram", "https://instagram.com/chatgpt")
//       .field("link_facebook", "https://facebook.com/chatgpt")
//       .attach("file", "C:/Users/ACER/BE-RSUD/tests/test-files/code.png");

//     console.log("Response body:", response.body);

//     expect(response.statusCode).toBe(201);
//     expect(response.body).toHaveProperty("success", true);
//     expect(response.body).toHaveProperty(
//       "message",
//       "Dokter berhasil ditambahkan"
//     );
//     expect(response.body).toHaveProperty("data.id");
//     expect(response.body).toHaveProperty("data.nama", "Dr. ChatGPT");
//     createdDokterSlug = response.body.data.slug;
//     createdDokterId = response.body.data.id;
//   });
//   it("response 400, badrequest | POST /api/v1/dokter", async () => {
//     const response = await supertest(app)
//       .post("/api/v1/dokter")
//       .set("Cookie", `aksesToken=${signedToken}`)
//       .field("nama", " ")
//       .field("id_poli", "0b4577fa-437b-4643-850d-5a4be524174b")
//       .field("biodata_singkat", " ")
//       .field("link_linkedin", "https://linkedin.com/in/chatgpt")
//       .field("link_instagram", "https://instagram.com/chatgpt")
//       .field("link_facebook", "https://facebook.com/chatgpt");

//     expect(response.statusCode).toBe(400);
//     expect(response.body).toHaveProperty("success", false);
//     expect(response.body).toHaveProperty("message", "Kolom tidak boleh kosong");
//   });
//   it("response 404, not found Poli |POST /api/v1/dokter", async () => {
//     const response = await supertest(app)
//       .post("/api/v1/dokter")
//       .set("Cookie", `aksesToken=${signedToken}`)
//       .field("nama", "admin 1")
//       .field("id_poli", "not-poli-id")
//       .field("biodata_singkat", "bio admin singkat ")
//       .field("link_linkedin", "https://linkedin.com/in/chatgpt")
//       .field("link_instagram", "https://instagram.com/chatgpt")
//       .field("link_facebook", "https://facebook.com/chatgpt")
//       .attach("file", "C:/Users/ACER/BE-RSUD/tests/test-files/code.png");

//     expect(response.statusCode).toBe(404);
//     expect(response.body).toHaveProperty("success", false);
//     expect(response.body).toHaveProperty("message", "Poli tidak ditemukan");
//   });

//   it("response 200, success |PUT /api/v1/dokter/:id", async () => {
//     const response = await supertest(app)
//       .put(`/api/v1/dokter/${createdDokterId}`)
//       .set("Cookie", `aksesToken=${signedToken}`)
//       .field("nama", "Dr. ChatGPT")
//       .field("id_poli", "0b4577fa-437b-4643-850d-5a4be524174b")
//       .field("biodata_singkat", "Ahli AI dan Kecerdasan Buatan")
//       .field("link_linkedin", "https://linkedin.com/in/chatgpt")
//       .field("link_instagram", "https://instagram.com/chatgpt")
//       .field("link_facebook", "https://facebook.com/chatgpt")
//       .attach("file", "C:/Users/ACER/BE-RSUD/tests/test-files/code.png");

//     console.log("Response body:", response.body);

//     expect(response.statusCode).toBe(200);
//     expect(response.body).toHaveProperty("success", true);
//     expect(response.body).toHaveProperty(
//       "message",
//       "Perubahan berhasil disimpan"
//     );
//     expect(response.body).toHaveProperty("data.id");
//     expect(response.body).toHaveProperty("data.nama", "Dr. ChatGPT");
//   });
//   it("response 400, badrequest |PUT /api/v1/dokter/:id", async () => {
//     const response = await supertest(app)
//       .put(`/api/v1/dokter/${createdDokterId}`)
//       .set("Cookie", `aksesToken=${signedToken}`)
//       .field("nama", " ")
//       .field("id_poli", "0b4577fa-437b-4643-850d-5a4be524174b")
//       .field("biodata_singkat", " ")
//       .field("link_linkedin", " ")
//       .field("link_instagram", " ")
//       .field("link_facebook", " ");

//     expect(response.statusCode).toBe(400);
//     expect(response.body).toHaveProperty("success", false);
//     expect(response.body).toHaveProperty(
//       "message",
//       "Nama, Poli, dan Biodata singkat harus diisi"
//     );
//   });
//   it("response 404, not found Poli or dokter |PUT /api/v1/dokter/:id", async () => {
//     const response = await supertest(app)
//       .put("/api/v1/dokter/URL-tidak-valid")
//       .set("Cookie", `aksesToken=${signedToken}`)
//       .field("nama", "admin 1")
//       .field("id_poli", "not-poli-id")
//       .field("biodata_singkat", "bio admin singkat ")
//       .field("link_linkedin", "https://linkedin.com/in/chatgpt")
//       .field("link_instagram", "https://instagram.com/chatgpt")
//       .field("link_facebook", "https://facebook.com/chatgpt")
//       .attach("file", "C:/Users/ACER/BE-RSUD/tests/test-files/code.png");

//     expect(response.statusCode).toBe(404);
//     expect(response.body).toHaveProperty("success", false);
//     expect(response.body).toHaveProperty(
//       "message",
//       "Poli atau dokter tidak ditemukan"
//     );
//   });
//   it("response 200, success |GET /api/v1/dokter", async () => {
//     const response = await supertest(app).get("/api/v1/dokter").expect(200);
//     expect(response.body).toHaveProperty("success", true);
//     expect(response.body).toHaveProperty("statusCode", 200);
//     expect(response.body).toHaveProperty(
//       "message",
//       "Berhasil menampilkan daftar dokter"
//     );
//     expect(response.body).toHaveProperty("data");
//     expect(response.body.data).toHaveProperty("Dokter");
//     expect(response.body.data.Dokter).toBeInstanceOf(Array);

//     response.body.data.Dokter.forEach((dokter) => {
//       expect(dokter).toHaveProperty("id_dokter");
//       expect(dokter).toHaveProperty("nama");
//       expect(dokter).toHaveProperty("slug");
//       expect(dokter).toHaveProperty("gambar");
//       expect(dokter).toHaveProperty("biodata_singkat");
//       expect(dokter).toHaveProperty("link_linkedin");
//       expect(dokter).toHaveProperty("link_instagram");
//       expect(dokter).toHaveProperty("link_facebook");
//       expect(dokter).toHaveProperty("poli");
//       expect(dokter.poli).toHaveProperty("id_poli");
//       expect(dokter.poli).toHaveProperty("nama_poli");
//     });

//     expect(response.body.data).toHaveProperty("pagination");
//     expect(response.body.data.pagination).toHaveProperty("currentPage");
//     expect(response.body.data.pagination).toHaveProperty("pageSize");
//     expect(response.body.data.pagination).toHaveProperty("totalItems");
//     expect(response.body.data.pagination).toHaveProperty("totalPages");
//   });
//   it("response 200, success |GET /api/v1/dokter/search", async () => {
//     const response = await supertest(app)
//       .get("/api/v1/dokter/search")
//       .query({ keyword: "umum", page: 1, pageSize: 10 });
//     expect(response.body).toHaveProperty("success", true);
//     expect(response.body).toHaveProperty("statusCode", 200);
//     expect(response.body).toHaveProperty(
//       "message",
//       "berhasil menampilkan dokter"
//     );
//     expect(response.body).toHaveProperty("data");
//     expect(response.body.data).toHaveProperty("Dokter");
//     expect(response.body.data.Dokter).toBeInstanceOf(Array);

//     response.body.data.Dokter.forEach((dokter) => {
//       expect(dokter).toHaveProperty("id_dokter");
//       expect(dokter).toHaveProperty("nama");
//       expect(dokter).toHaveProperty("gambar");
//       expect(dokter).toHaveProperty("biodata_singkat");
//       expect(dokter).toHaveProperty("link_linkedin");
//       expect(dokter).toHaveProperty("link_instagram");
//       expect(dokter).toHaveProperty("link_facebook");
//       expect(dokter).toHaveProperty("poli");
//       expect(dokter.poli).toHaveProperty("id_poli");
//       expect(dokter.poli).toHaveProperty("nama_poli");
//     });

//     expect(response.body.data).toHaveProperty("pagination");
//     expect(response.body.data.pagination).toHaveProperty("currentPage");
//     expect(response.body.data.pagination).toHaveProperty("pageSize");
//     expect(response.body.data.pagination).toHaveProperty("totalItems");
//     expect(response.body.data.pagination).toHaveProperty("totalPages");
//   });
//   it("response 200, success |GET /api/v1/dokter/:slug", async () => {
//     const response = await supertest(app).get(
//       `/api/v1/dokter/${createdDokterSlug}`
//     );

//     expect(response.body).toHaveProperty("success", true);
//     expect(response.body).toHaveProperty("statusCode", 200);
//     expect(response.body).toHaveProperty(
//       "message",
//       "Berhasil mengambil data Dokter"
//     );
//     expect(response.body).toHaveProperty("data");
//     expect(response.body.data).toHaveProperty("dokter");

//     expect(response.body.data.dokter).toHaveProperty("id_dokter");
//     expect(response.body.data.dokter).toHaveProperty("nama");
//     expect(response.body.data.dokter).toHaveProperty("gambar");
//     expect(response.body.data.dokter).toHaveProperty("biodata_singkat");
//     expect(response.body.data.dokter).toHaveProperty("link_linkedin");
//     expect(response.body.data.dokter).toHaveProperty("link_instagram");
//     expect(response.body.data.dokter).toHaveProperty("link_facebook");
//     expect(response.body.data.dokter).toHaveProperty("poli");
//     expect(response.body.data.dokter.poli).toHaveProperty("id_poli");
//     expect(response.body.data.dokter.poli).toHaveProperty("nama_poli");
//   });
//   it("response 200, success |DELETE /api/v1/dokter/:id", async () => {
//     const response = await supertest(app)
//       .delete(`/api/v1/dokter/${createdDokterId}`)
//       .set("Cookie", `aksesToken=${signedToken}`);

//     expect(response.body).toHaveProperty("success", true);
//     expect(response.body).toHaveProperty("statusCode", 200);
//     expect(response.body).toHaveProperty(
//       "message",
//       "Data dokter berhasil dihapus"
//     );
//   });
//   it("response 404, not found |DELETE /api/v1/dokter/:id", async () => {
//     const response = await supertest(app)
//       .delete("/api/v1/dokter/URL-tidak-valid")
//       .set("Cookie", `aksesToken=${signedToken}`);

//     expect(response.statusCode).toBe(404);
//     expect(response.body).toHaveProperty("success", false);
//     expect(response.body).toHaveProperty("message", "Dokter tidak ditemukan");
//   });
// });
