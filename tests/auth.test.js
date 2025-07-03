const supertest = require("supertest");
const app = require("../app");
const {
  validatePasswordStrength,
} = require("../src/utils/password-validator-utils");
const cookie = require("cookie-signature"); // Tambahkan ini
const { cookieSecret } = require("../src/configs/env-config"); // sesuaikan path jika perlu

describe("SUKSES: test endpoint auth", () => {
  let refreshTokenCookie = "";
  let accessTokenCookie = "";

  const emailUnik = `adminbaru+${Date.now()}@gmail.com`; // agar tidak bentrok

  test("POST /api/v1/auth/register", async () => {
    const payload = {
      nama: "Admin Baru",
      email: emailUnik,
      password: "@Ahazain123",
      no_wa: "081234567890",
      // role: "ADMIN",
    };

    expect(() => validatePasswordStrength(payload.password)).not.toThrow();

    const response = await supertest(app)
      .post("/api/v1/auth/register")
      .send(payload);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.statusCode).toBe(201);
    expect(response.body.message).toBe("Akun Admin berhasil registrasi");
    expect(response.body.data).toHaveProperty("id_user");
    expect(response.body.data.email).toBe(payload.email);
  });

  test("POST /api/v1/auth/login", async () => {
    const payload = {
      email: emailUnik,
      password: "@Ahazain123",
    };

    const response = await supertest(app)
      .post("/api/v1/auth/login")
      .send(payload);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.statusCode).toBe(200);
    expect(response.body.message).toBe("Login Success");
    expect(response.body.data).toHaveProperty("aksesToken");
    expect(response.body.data).toHaveProperty("refreshToken");

    const cookies = response.headers["set-cookie"];

    const refreshTokenCookieString = cookies.find((cookie) =>
      cookie.startsWith("refreshToken=")
    );
    expect(refreshTokenCookieString).toBeDefined();
    refreshTokenCookie = refreshTokenCookieString.split(";")[0];

    const accessTokenCookieString = cookies.find((cookie) =>
      cookie.startsWith("aksesToken=")
    );
    expect(accessTokenCookieString).toBeDefined();
    accessTokenCookie = accessTokenCookieString.split(";")[0];
  });

  test("POST /api/v1/auth/refresh-token", async () => {
    expect(refreshTokenCookie).toBeDefined();

    const response = await supertest(app)
      .post("/api/v1/auth/refresh-token")
      .set("Cookie", refreshTokenCookie)
      .send();

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("berhasil refresh token");
    expect(response.body.data).toHaveProperty("aksesToken");
    expect(response.body.data).toHaveProperty("refreshToken");

    const cookies = response.headers["set-cookie"];
    if (cookies) {
      const newAccessTokenCookie = cookies.find((cookie) =>
        cookie.startsWith("aksesToken=")
      );
      if (newAccessTokenCookie) {
        accessTokenCookie = newAccessTokenCookie.split(";")[0];
      }
    }
  });

  test("GET /api/v1/profil", async () => {
    const response = await supertest(app)
      .get("/api/v1/profil")
      .set("Cookie", [accessTokenCookie]);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("message", "Profile berhasil diambil");
    expect(response.body).toHaveProperty("data");
  });
  test("PUT /api/v1/profil/ubah-password", async () => {
    const payload = {
      oldPassword: "@Ahazain123",
      newPassword: "@Ahazain1234",
    };
    console.log("oldPassword:", payload.oldPassword);
    console.log("newPassword:", payload.newPassword);
    const result = validatePasswordStrength(payload.newPassword);
    expect(result.strong).toBe(true);

    const response = await supertest(app)
      .put("/api/v1/profil/ubah-password")
      .set("Cookie", [accessTokenCookie])
      .send(payload);

    console.log("respons body pw:", response.body);
   

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("message", "Password berhasil diubah");
    expect(response.body.data).toBeNull();
  });

  test("PUT /api/v1/profil", async () => {
    const payload = {
      nama: "user Baru Update",
      email: emailUnik,
      no_wa: "081234567891",
    };

    const response = await supertest(app)
      .put("/api/v1/profil")
      .set("Cookie", [accessTokenCookie])
      .send(payload);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("message", "berhasil update profil");
    expect(response.body.data).toHaveProperty("id_user");
    expect(response.body.data.email).toBe(payload.email);
  });

  test("POST /api/v1/auth/logout", async () => {
    expect(refreshTokenCookie).toBeDefined();
    expect(accessTokenCookie).toBeDefined();

    const allCookies = `${refreshTokenCookie}; ${accessTokenCookie}`;

    const response = await supertest(app)
      .post("/api/v1/auth/logout")
      .set("Cookie", allCookies)
      .send();

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Berhasil logout");
  });
});
