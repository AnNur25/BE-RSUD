const supertest = require("supertest");
const app = require("../app");
const jwt = require("jsonwebtoken");
const cookie = require("cookie-signature");
const { cookieSecret, aksesSecret } = require("../src/configs/env-config");

describe("GET PUT data layanan unggulan", () => {
  let signedToken;
  let existingLayananId;
  let existingImageIds = []; // Menyimpan ID gambar yang valid

  beforeAll(async () => {
    const payload = {
      id_user: "test-user-id",
      nama: "Test Admin",
      email: "admin@gmail.com",
      no_wa: "08123456789",
      role: "ADMIN",
    };

    const token = jwt.sign(payload, aksesSecret, { expiresIn: "15m" });
    signedToken = cookie.sign(token, cookieSecret);

    // Dapatkan data layanan yang ada dan ambil ID gambar yang valid
    const getResponse = await supertest(app).get("/api/v1/layanan-unggulan");

    if (getResponse.statusCode === 200 && getResponse.body.data) {
      if (
        Array.isArray(getResponse.body.data) &&
        getResponse.body.data.length > 0
      ) {
        existingLayananId = getResponse.body.data[0].id_layanan_unggulan;
        // Ambil ID gambar yang ada
        if (
          getResponse.body.data[0].gambar &&
          getResponse.body.data[0].gambar.length > 0
        ) {
          existingImageIds = getResponse.body.data[0].gambar.map(
            (img) => img.id
          );
        }
      } else if (getResponse.body.data.id_layanan_unggulan) {
        existingLayananId = getResponse.body.data.id_layanan_unggulan;
        if (
          getResponse.body.data.gambar &&
          getResponse.body.data.gambar.length > 0
        ) {
          existingImageIds = getResponse.body.data.gambar.map((img) => img.id);
        }
      }
    }

    console.log("Existing Layanan ID:", existingLayananId);
    console.log("Existing Image IDs:", existingImageIds);
  });

  it("response 200, get all layanan unggulan | GET /api/v1/layanan-unggulan", async () => {
    const response = await supertest(app).get("/api/v1/layanan-unggulan");

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("success", true);
    expect(response.body).toHaveProperty(
      "message",
      "Berhasil mendapatkan semua layanan unggulan"
    );
    expect(response.body).toHaveProperty("data");
  });

  it("response 200, update layanan unggulan dengan existing images | PUT /api/v1/layanan-unggulan/:id", async () => {
    if (!existingLayananId) {
      console.log("Skip test: No existing layanan found");
      return;
    }

    // Gunakan ID gambar yang benar-benar ada, atau kosongkan jika tidak ada
    const existingImages =
      existingImageIds.length > 0
        ? JSON.stringify([
            { id: existingImageIds[0], caption: "Caption yang sudah ada" },
          ])
        : JSON.stringify([]);

    // Jika tidak ada existing images, tambahkan gambar baru
    const gambarCaption =
      existingImageIds.length === 0
        ? JSON.stringify([{ caption: "Caption gambar baru" }])
        : JSON.stringify([]);

    const requestBuilder = supertest(app)
      .put(`/api/v1/layanan-unggulan/${existingLayananId}`)
      .set("Cookie", `aksesToken=${signedToken}`)
      .field("judul", "Layanan Unggulan Test Update")
      .field("deskripsi", "Deskripsi layanan unggulan yang telah diperbarui")
      .field("existingImages", existingImages)
      .field("gambarCaption", gambarCaption)
      .timeout(30000);

    // Tambahkan file jika tidak ada existing images
    if (existingImageIds.length === 0) {
      requestBuilder.attach(
        "file",
        "C:/Users/ACER/BE-RSUD/tests/test-files/unej.png"
      );
    }

    const response = await requestBuilder;

    if (response.statusCode !== 200) {
      console.log("=== DEBUG INFO ===");
      console.log("Status Code:", response.statusCode);
      console.log("Response Body:", JSON.stringify(response.body, null, 2));
      console.log("Existing Layanan ID:", existingLayananId);
      console.log("Existing Image IDs:", existingImageIds);
      console.log("==================");
    }

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("success", true);
    expect(response.body).toHaveProperty(
      "message",
      "Perubahan berhasil disimpan"
    );
  });

  it("response 200, update layanan unggulan dengan gambar | PUT /api/v1/layanan-unggulan/:id", async () => {
    if (!existingLayananId) {
      console.log("Skip test: No existing layanan found");
      return;
    }

    const existingImages = JSON.stringify([]);
    const gambarCaption = JSON.stringify([
      { caption: "Caption untuk gambar test" },
    ]);

    const response = await supertest(app)
      .put(`/api/v1/layanan-unggulan/${existingLayananId}`)
      .set("Cookie", `aksesToken=${signedToken}`)
      .field("judul", "Layanan Unggulan Test dengan Gambar")
      .field("deskripsi", "Deskripsi layanan unggulan dengan gambar baru")
      .field("existingImages", existingImages)
      .field("gambarCaption", gambarCaption)
      .attach("file", "C:/Users/ACER/BE-RSUD/tests/test-files/unej.png")
      .timeout(30000);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("success", true);
    expect(response.body).toHaveProperty(
      "message",
      "Perubahan berhasil disimpan"
    );
  });

  it("response 200, update layanan unggulan dengan multiple gambar | PUT /api/v1/layanan-unggulan/:id", async () => {
    if (!existingLayananId) {
      console.log("Skip test: No existing layanan found");
      return;
    }

    const existingImages = JSON.stringify([]);
    const gambarCaption = JSON.stringify([
      { caption: "Caption untuk gambar pertama" },
      { caption: "Caption untuk gambar kedua" },
    ]);

    const response = await supertest(app)
      .put(`/api/v1/layanan-unggulan/${existingLayananId}`)
      .set("Cookie", `aksesToken=${signedToken}`)
      .field("judul", "Layanan Unggulan Test Multiple Gambar")
      .field("deskripsi", "Deskripsi layanan unggulan dengan multiple gambar")
      .field("existingImages", existingImages)
      .field("gambarCaption", gambarCaption)
      .attach("file", "C:/Users/ACER/BE-RSUD/tests/test-files/unej.png")
      .attach("file", "C:/Users/ACER/BE-RSUD/tests/test-files/unej.png")
      .timeout(30000);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("success", true);
    expect(response.body).toHaveProperty(
      "message",
      "Perubahan berhasil disimpan"
    );
  });

  it("response 400, minimal 1 gambar diperlukan | PUT /api/v1/layanan-unggulan/:id", async () => {
    if (!existingLayananId) {
      console.log("Skip test: No existing layanan found");
      return;
    }

    const existingImages = JSON.stringify([]);
    const gambarCaption = JSON.stringify([]);

    const response = await supertest(app)
      .put(`/api/v1/layanan-unggulan/${existingLayananId}`)
      .set("Cookie", `aksesToken=${signedToken}`)
      .field("judul", "Layanan Unggulan Test Update")
      .field("deskripsi", "Deskripsi layanan unggulan yang telah diperbarui")
      .field("existingImages", existingImages)
      .field("gambarCaption", gambarCaption)
      .timeout(30000);

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("success", false);
    expect(response.body.message).toContain("minimal 1 gambar-caption");
  });

  it("response 400, bad request - judul kosong | PUT /api/v1/layanan-unggulan/:id", async () => {
    if (!existingLayananId) {
      console.log("Skip test: No existing layanan found");
      return;
    }

    // Gunakan ID gambar yang valid atau kosongkan
    const existingImages =
      existingImageIds.length > 0
        ? JSON.stringify([
            { id: existingImageIds[0], caption: "Caption yang sudah ada" },
          ])
        : JSON.stringify([]);

    const gambarCaption =
      existingImageIds.length === 0
        ? JSON.stringify([{ caption: "Caption gambar baru" }])
        : JSON.stringify([]);

    const requestBuilder = supertest(app)
      .put(`/api/v1/layanan-unggulan/${existingLayananId}`)
      .set("Cookie", `aksesToken=${signedToken}`)
      .field("judul", "")
      .field("deskripsi", "Deskripsi layanan unggulan")
      .field("existingImages", existingImages)
      .field("gambarCaption", gambarCaption)
      .timeout(30000);

    if (existingImageIds.length === 0) {
      requestBuilder.attach(
        "file",
        "C:/Users/ACER/BE-RSUD/tests/test-files/unej.png"
      );
    }

    const response = await requestBuilder;

    expect(response.statusCode).toBe(400);
    if (response.body.success !== undefined) {
      expect(response.body).toHaveProperty("success", false);
    } else {
      expect(response.body).toHaveProperty("status", "Failed");
    }
    expect(response.body.message).toContain("Judul dan deskripsi harus diisi");
  });

  it("response 400, bad request - deskripsi kosong | PUT /api/v1/layanan-unggulan/:id", async () => {
    if (!existingLayananId) {
      console.log("Skip test: No existing layanan found");
      return;
    }

    const existingImages =
      existingImageIds.length > 0
        ? JSON.stringify([
            { id: existingImageIds[0], caption: "Caption yang sudah ada" },
          ])
        : JSON.stringify([]);

    const gambarCaption =
      existingImageIds.length === 0
        ? JSON.stringify([{ caption: "Caption gambar baru" }])
        : JSON.stringify([]);

    const requestBuilder = supertest(app)
      .put(`/api/v1/layanan-unggulan/${existingLayananId}`)
      .set("Cookie", `aksesToken=${signedToken}`)
      .field("judul", "Layanan Unggulan Test")
      .field("deskripsi", "")
      .field("existingImages", existingImages)
      .field("gambarCaption", gambarCaption)
      .timeout(30000);

    if (existingImageIds.length === 0) {
      requestBuilder.attach(
        "file",
        "C:/Users/ACER/BE-RSUD/tests/test-files/unej.png"
      );
    }

    const response = await requestBuilder;

    expect(response.statusCode).toBe(400);
    if (response.body.success !== undefined) {
      expect(response.body).toHaveProperty("success", false);
    } else {
      expect(response.body).toHaveProperty("status", "Failed");
    }
    expect(response.body.message).toContain("Judul dan deskripsi harus diisi");
  });

  it("response 400, bad request - format existingImages tidak valid | PUT /api/v1/layanan-unggulan/:id", async () => {
    if (!existingLayananId) {
      console.log("Skip test: No existing layanan found");
      return;
    }

    const response = await supertest(app)
      .put(`/api/v1/layanan-unggulan/${existingLayananId}`)
      .set("Cookie", `aksesToken=${signedToken}`)
      .field("judul", "Layanan Unggulan Test")
      .field("deskripsi", "Deskripsi layanan unggulan")
      .field("existingImages", "invalid-json")
      .field("gambarCaption", "[]")
      .timeout(30000);

    expect(response.statusCode).toBe(400);
    if (response.body.success !== undefined) {
      expect(response.body).toHaveProperty("success", false);
    } else {
      expect(response.body).toHaveProperty("status", "Failed");
    }
    expect(response.body.message).toContain(
      "Format existingImages tidak valid"
    );
  });

  it("response 400, bad request - format gambarCaption tidak valid | PUT /api/v1/layanan-unggulan/:id", async () => {
    if (!existingLayananId) {
      console.log("Skip test: No existing layanan found");
      return;
    }

    const response = await supertest(app)
      .put(`/api/v1/layanan-unggulan/${existingLayananId}`)
      .set("Cookie", `aksesToken=${signedToken}`)
      .field("judul", "Layanan Unggulan Test")
      .field("deskripsi", "Deskripsi layanan unggulan")
      .field("existingImages", "[]")
      .field("gambarCaption", "invalid-json")
      .timeout(30000);

    expect(response.statusCode).toBe(400);
    if (response.body.success !== undefined) {
      expect(response.body).toHaveProperty("success", false);
    } else {
      expect(response.body).toHaveProperty("status", "Failed");
    }
    expect(response.body.message).toContain(
      "Layanan harus memiliki minimal 1 gambar-caption."
    );
  });

  it("response 400, bad request - maksimal 4 gambar | PUT /api/v1/layanan-unggulan/:id", async () => {
    if (!existingLayananId) {
      console.log("Skip test: No existing layanan found");
      return;
    }

    const existingImages = JSON.stringify([]);
    const gambarCaption = JSON.stringify([
      { caption: "Caption 1" },
      { caption: "Caption 2" },
      { caption: "Caption 3" },
      { caption: "Caption 4" },
      { caption: "Caption 5" },
    ]);

    const response = await supertest(app)
      .put(`/api/v1/layanan-unggulan/${existingLayananId}`)
      .set("Cookie", `aksesToken=${signedToken}`)
      .field("judul", "Layanan Unggulan Test")
      .field("deskripsi", "Deskripsi layanan unggulan")
      .field("existingImages", existingImages)
      .field("gambarCaption", gambarCaption)
      .attach("file", "C:/Users/ACER/BE-RSUD/tests/test-files/unej.png")
      .attach("file", "C:/Users/ACER/BE-RSUD/tests/test-files/unej.png")
      .attach("file", "C:/Users/ACER/BE-RSUD/tests/test-files/unej.png")
      .attach("file", "C:/Users/ACER/BE-RSUD/tests/test-files/unej.png")
      .attach("file", "C:/Users/ACER/BE-RSUD/tests/test-files/unej.png")
      .timeout(30000);

    expect(response.statusCode).toBe(400);
    if (response.body.success !== undefined) {
      expect(response.body).toHaveProperty("success", false);
    } else {
      expect(response.body).toHaveProperty("status", "Failed");
      expect(response.body).toHaveProperty("statusCode", 400);
    }
    expect(response.body.message).toContain("Maksimal 4 gambar");
  });

  it("response 404, layanan tidak ditemukan | PUT /api/v1/layanan-unggulan/:id", async () => {
    const existingImages = JSON.stringify([]);
    const gambarCaption = JSON.stringify([{ caption: "Caption gambar baru" }]);

    const response = await supertest(app)
      .put("/api/v1/layanan-unggulan/nonexistent-id")
      .set("Cookie", `aksesToken=${signedToken}`)
      .field("judul", "Layanan Unggulan Test")
      .field("deskripsi", "Deskripsi layanan unggulan")
      .field("existingImages", existingImages)
      .field("gambarCaption", gambarCaption)
      .attach("file", "C:/Users/ACER/BE-RSUD/tests/test-files/unej.png")
      .timeout(30000);

    expect(response.statusCode).toBe(404);
    if (response.body.success !== undefined) {
      expect(response.body).toHaveProperty("success", false);
    } else {
      expect(response.body).toHaveProperty("status", "Failed");
    }
    expect(response.body.message).toContain("Layanan tidak ditemukan");
  });
});
