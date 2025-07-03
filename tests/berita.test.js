// const supertest = require("supertest");
// const app = require("../app");
// const jwt = require("jsonwebtoken");
// const cookie = require("cookie-signature");
// const path = require("path");
// const fs = require("fs");
// const { cookieSecret, aksesSecret } = require("../src/configs/env-config");

// describe("SUKSES: test endpoint CRUD Berita", () => {
//   let signedToken;
//   let createdBeritaId;
//   let createdBeritaSlug;

//   beforeEach(() => {
//     const payload = {
//       id_user: "test-user-id",
//       nama: "Test Admin",
//       email: "admin@gmail.com",
//       no_wa: "08123456789",
//       role: "ADMIN",
//     };

//     const token = jwt.sign(payload, aksesSecret, { expiresIn: "15m" });
//     signedToken = cookie.sign(token, cookieSecret);
//   });

//   // Test untuk membuat berita baru
//   it("POST /api/v1/berita - Membuat berita baru dengan gambar", async () => {
//     const testImagePath = path.join(__dirname, "test-files", "unej.png");

//     // Tambahkan timeout lebih lama untuk upload file
//     jest.setTimeout(30000);

//     // Pastikan file exists
//     if (!fs.existsSync(testImagePath)) {
//       throw new Error(`Test image not found at: ${testImagePath}`);
//     }

//     console.log("Test image path:", testImagePath);
//     console.log("File exists:", fs.existsSync(testImagePath));

//     const response = await supertest(app)
//       .post("/api/v1/berita")
//       .set("Cookie", `aksesToken=${signedToken}`)
//       .field("judul", "Judul Berita Test")
//       .field("ringkasan", "Ini adalah ringkasan berita test untuk pengujian")
//       .field(
//         "isi",
//         "Ini adalah isi berita test yang lebih panjang untuk pengujian endpoint API"
//       )
//       .field("tanggal_berita", "2024-01-15")
//       .attach("file", testImagePath)
//       .timeout(30000) // Tambahkan timeout untuk request
//       .expect(201);

//     expect(response.body).toHaveProperty("success", true);
//     expect(response.body).toHaveProperty("statusCode", 201);
//     expect(response.body).toHaveProperty(
//       "message",
//       "Berita berhasil ditambahkan"
//     );
//     expect(response.body.data).toHaveProperty("id");
//     expect(response.body.data).toHaveProperty("judul", "Judul Berita Test");
//     expect(response.body.data).toHaveProperty("slug");
//     expect(response.body.data).toHaveProperty("tanggal_dibuat");
//     expect(response.body.data).toHaveProperty("tanggal_default");

//     // Simpan ID dan slug untuk test selanjutnya
//     createdBeritaId = response.body.data.id;
//     createdBeritaSlug = response.body.data.slug;
//   });

//   // Test untuk mendapatkan semua berita dengan pagination
//   it("GET /api/v1/berita - Mendapatkan daftar berita dengan pagination", async () => {
//     const response = await supertest(app)
//       .get("/api/v1/berita")
//       .query({ page: 1, pageSize: 9 })
//       .expect(200);

//     expect(response.body).toHaveProperty("success", true);
//     expect(response.body).toHaveProperty("statusCode", 200);
//     expect(response.body).toHaveProperty(
//       "message",
//       "Berhasil menampilkan berita"
//     );
//     expect(response.body.data).toHaveProperty("berita");
//     expect(response.body.data).toHaveProperty("pagination");
//     expect(Array.isArray(response.body.data.berita)).toBe(true);

//     // Validasi struktur pagination
//     expect(response.body.data.pagination).toHaveProperty("currentPage");
//     expect(response.body.data.pagination).toHaveProperty("pageSize");
//     expect(response.body.data.pagination).toHaveProperty("totalItems");
//     expect(response.body.data.pagination).toHaveProperty("totalPages");

//     // Validasi struktur data berita
//     if (response.body.data.berita.length > 0) {
//       const berita = response.body.data.berita[0];
//       expect(berita).toHaveProperty("id");
//       expect(berita).toHaveProperty("judul");
//       expect(berita).toHaveProperty("slug");
//       expect(berita).toHaveProperty("ringkasan");
//       expect(berita).toHaveProperty("gambar_sampul");
//       expect(berita).toHaveProperty("tanggal_dibuat");
//       expect(berita).toHaveProperty("tanggal_default");
//     }
//   });
//   // Test untuk mendapatkan semua berita dengan pagination
//   it("GET /api/v1/berita - Mendapatkan daftar berita dengan pagination", async () => {
//     const response = await supertest(app)
//       .get("/api/v1/berita")
//       .query({ page: 1, pageSize: 9 })
//       .expect(200);

//     expect(response.body).toHaveProperty("success", true);
//     expect(response.body).toHaveProperty("statusCode", 200);
//     expect(response.body).toHaveProperty(
//       "message",
//       "Berhasil menampilkan berita"
//     );
//     expect(response.body.data).toHaveProperty("berita");
//     expect(response.body.data).toHaveProperty("pagination");
//     expect(Array.isArray(response.body.data.berita)).toBe(true);

//     // Validasi struktur pagination
//     expect(response.body.data.pagination).toHaveProperty("currentPage");
//     expect(response.body.data.pagination).toHaveProperty("pageSize");
//     expect(response.body.data.pagination).toHaveProperty("totalItems");
//     expect(response.body.data.pagination).toHaveProperty("totalPages");

//     // Validasi struktur data berita
//     if (response.body.data.berita.length > 0) {
//       const berita = response.body.data.berita[0];
//       expect(berita).toHaveProperty("id");
//       expect(berita).toHaveProperty("judul");
//       expect(berita).toHaveProperty("slug");
//       expect(berita).toHaveProperty("ringkasan");
//       expect(berita).toHaveProperty("gambar_sampul");
//       expect(berita).toHaveProperty("tanggal_dibuat");
//       expect(berita).toHaveProperty("tanggal_default");
//     }
//   });

//   // Test untuk mendapatkan berita berdasarkan slug
//   it("GET /api/v1/berita/:slug - Mendapatkan detail berita berdasarkan slug", async () => {
//     // Gunakan slug yang sudah dibuat pada test sebelumnya
//     const testSlug = createdBeritaSlug || "test-berita-slug";

//     const response = await supertest(app)
//       .get(`/api/v1/berita/${testSlug}`)
//       .expect(200);

//     expect(response.body).toHaveProperty("success", true);
//     expect(response.body).toHaveProperty("statusCode", 200);
//     expect(response.body).toHaveProperty(
//       "message",
//       "berhasil menampilkan detail berita"
//     );
//     expect(response.body.data).toHaveProperty("id");
//     expect(response.body.data).toHaveProperty("judul");
//     expect(response.body.data).toHaveProperty("slug");
//     expect(response.body.data).toHaveProperty("ringkasan");
//     expect(response.body.data).toHaveProperty("isi");
//     expect(response.body.data).toHaveProperty("gambar_sampul");
//     expect(response.body.data).toHaveProperty("tanggal_dibuat");
//     expect(response.body.data).toHaveProperty("tanggal_default");
//     expect(response.body.data).toHaveProperty("gambar_tambahan");
//     expect(Array.isArray(response.body.data.gambar_tambahan)).toBe(true);
//   });

//   // Test untuk mengupdate berita
//   it("PUT /api/v1/berita/:id - Mengupdate berita", async () => {
//     const testImagePath = path.join(__dirname, "test-files", "code.png");
//     const testId = createdBeritaId || "test-berita-id";

//     const response = await supertest(app)
//       .put(`/api/v1/berita/${testId}`)
//       .set("Cookie", `aksesToken=${signedToken}`)
//       .field("judul", "Judul Berita Updated")
//       .field("ringkasan", "Ringkasan berita yang sudah diupdate")
//       .field(
//         "isi",
//         "Isi berita yang sudah diupdate dengan konten yang lebih lengkap"
//       )
//       .field("tanggal_berita", "2024-01-16")
//       .attach("file", testImagePath)
//       .expect(200);

//     expect(response.body).toHaveProperty("success", true);
//     expect(response.body).toHaveProperty("statusCode", 200);
//     expect(response.body).toHaveProperty(
//       "message",
//       "Perubahan berhasil disimpan"
//     );
//     expect(response.body.data).toHaveProperty("id");
//     expect(response.body.data).toHaveProperty("judul", "Judul Berita Updated");
//     expect(response.body.data).toHaveProperty("tanggal_dibuat");
//     expect(response.body.data).toHaveProperty("tanggal_default");
//   });

//   // Test untuk mencari berita berdasarkan keyword
//   it("GET /api/v1/berita/search - Mencari berita berdasarkan keyword", async () => {
//     const response = await supertest(app)
//       .get("/api/v1/berita/search")
//       .query({
//         keyword: "test",
//         page: 1,
//         pageSize: 9,
//       })
//       .expect(200);

//     expect(response.body).toHaveProperty("success", true);
//     expect(response.body).toHaveProperty("statusCode", 200);
//     expect(response.body).toHaveProperty(
//       "message",
//       "berhasil menampilkan berita"
//     );
//     expect(response.body.data).toHaveProperty("berita");
//     expect(response.body.data).toHaveProperty("pagination");
//     expect(Array.isArray(response.body.data.berita)).toBe(true);

//     // Validasi struktur pagination
//     expect(response.body.data.pagination).toHaveProperty("currentPage");
//     expect(response.body.data.pagination).toHaveProperty("pageSize");
//     expect(response.body.data.pagination).toHaveProperty("totalItems");
//     expect(response.body.data.pagination).toHaveProperty("totalPages");
//   });

//   // Test untuk mendapatkan galeri berita
//   it("GET /api/v1/berita/:id/galeri - Mendapatkan galeri berita", async () => {
//     const testId = createdBeritaId || "test-berita-id";

//     const response = await supertest(app)
//       .get(`/api/v1/berita/${testId}/galeri`)
//       .set("Cookie", `aksesToken=${signedToken}`)
//       .expect(200);

//     expect(response.body).toHaveProperty("success", true);
//     expect(response.body).toHaveProperty("statusCode", 200);
//     expect(response.body).toHaveProperty(
//       "message",
//       "Berhasil menampilkan gambar"
//     );
//     expect(Array.isArray(response.body.data)).toBe(true);

//     // Jika ada gambar, validasi strukturnya
//     if (response.body.data.length > 0) {
//       const gambar = response.body.data[0];
//       expect(gambar).toHaveProperty("id");
//       expect(gambar).toHaveProperty("url");
//     }
//   });

//   // Test untuk upload gambar tambahan
//   it("POST /api/v1/berita/:id/gambar - Upload gambar tambahan", async () => {
//     const testImagePath1 = path.join(__dirname, "test-files", "code.png");
//     const testImagePath2 = path.join(__dirname, "test-files", "duren.jpg");
//     const testId = createdBeritaId || "test-berita-id";

//     const response = await supertest(app)
//       .post(`/api/v1/berita/${testId}/gambar`)
//       .set("Cookie", `aksesToken=${signedToken}`)
//       .attach("files", testImagePath1)
//       .attach("files", testImagePath2)
//       .expect(201);

//     expect(response.body).toHaveProperty("success", true);
//     expect(response.body).toHaveProperty("statusCode", 201);
//     expect(response.body).toHaveProperty(
//       "message",
//       "Foto berhasil ditambahkan"
//     );
//     expect(Array.isArray(response.body.data)).toBe(true);

//     // Validasi struktur gambar yang diupload
//     if (response.body.data.length > 0) {
//       const gambar = response.body.data[0];
//       expect(gambar).toHaveProperty("id");
//       expect(gambar).toHaveProperty("url");
//     }
//   });

//   // Test untuk menghapus gambar
//   it("DELETE /api/v1/berita/:id/gambar - Menghapus gambar berita", async () => {
//     const testId = createdBeritaId || "test-berita-id";

//     // Daftar ID gambar yang akan dihapus (sesuaikan dengan gambar yang ada)
//     const gambarIds = ["gambar-id-1", "gambar-id-2"];

//     const response = await supertest(app)
//       .delete(`/api/v1/berita/${testId}/gambar`)
//       .set("Cookie", `aksesToken=${signedToken}`)
//       .send({ ids: gambarIds })
//       .expect(200);

//     expect(response.body).toHaveProperty("success", true);
//     expect(response.body).toHaveProperty("statusCode", 200);
//     expect(response.body).toHaveProperty("message", "Foto berhasil dihapus");
//     expect(Array.isArray(response.body.data)).toBe(true);

//     // Validasi data gambar yang dihapus
//     if (response.body.data.length > 0) {
//       const deletedGambar = response.body.data[0];
//       expect(deletedGambar).toHaveProperty("id");
//       expect(deletedGambar).toHaveProperty("fileName");
//     }
//   });

//   // Test untuk menghapus berita
//   it("DELETE /api/v1/berita/:id - Menghapus berita", async () => {
//     const testId = createdBeritaId || "test-berita-id";

//     const response = await supertest(app)
//       .delete(`/api/v1/berita/${testId}`)
//       .set("Cookie", `aksesToken=${signedToken}`)
//       .expect(200);

//     expect(response.body).toHaveProperty("success", true);
//     expect(response.body).toHaveProperty("statusCode", 200);
//     expect(response.body).toHaveProperty("message", "Berita berhasil dihapus");
//     expect(response.body.data).toBeNull();
//   });
// });

// // Test khusus untuk edge cases dan validasi
// describe("SUKSES: test endpoint Berita - Edge Cases", () => {
//   let signedToken;

//   beforeEach(() => {
//     const payload = {
//       id_user: "test-user-id",
//       nama: "Test Admin",
//       email: "admin@gmail.com",
//       no_wa: "08123456789",
//       role: "ADMIN",
//     };

//     const token = jwt.sign(payload, aksesSecret, { expiresIn: "15m" });
//     signedToken = cookie.sign(token, cookieSecret);
//   });

//   // Test untuk pagination dengan parameter berbeda
//   it("GET /api/v1/berita - Test pagination dengan pageSize berbeda", async () => {
//     const response = await supertest(app)
//       .get("/api/v1/berita")
//       .query({ page: 2, pageSize: 5 })
//       .expect(200);

//     expect(response.body).toHaveProperty("success", true);
//     expect(response.body.data.pagination).toHaveProperty("currentPage", 2);
//     expect(response.body.data.pagination).toHaveProperty("pageSize", 5);
//   });

//   // Test untuk pencarian dengan keyword yang lebih spesifik
//   it("GET /api/v1/berita/search - Test pencarian dengan keyword spesifik", async () => {
//     const response = await supertest(app)
//       .get("/api/v1/berita/search")
//       .query({
//         keyword: "kesehatan",
//         page: 1,
//         pageSize: 10,
//       })
//       .expect(200);

//     expect(response.body).toHaveProperty("success", true);
//     expect(response.body.data.pagination).toHaveProperty("pageSize", 10);
//   });

//   // Test untuk update berita tanpa file
//   it("PUT /api/v1/berita/:id - Update berita tanpa mengubah gambar", async () => {
//     const testId = "existing-berita-id"; // Gunakan ID berita yang sudah ada

//     const response = await supertest(app)
//       .put(`/api/v1/berita/${testId}`)
//       .set("Cookie", `aksesToken=${signedToken}`)
//       .send({
//         judul: "Judul Berita Updated Tanpa Gambar",
//         ringkasan: "Ringkasan update tanpa gambar",
//         isi: "Isi berita update tanpa mengubah gambar",
//         tanggal_berita: "2024-01-17",
//       })
//       .expect(200);

//     expect(response.body).toHaveProperty("success", true);
//     expect(response.body).toHaveProperty(
//       "message",
//       "Perubahan berhasil disimpan"
//     );
//     expect(response.body.data).toHaveProperty(
//       "judul",
//       "Judul Berita Updated Tanpa Gambar"
//     );
//   });
// });
