const supertest = require("supertest");
const app = require("../app"); //bisa akses semua route & middleware
const passwordStrengthTest = require("owasp-password-strength-test");

describe("SUKSES: test endpoint auth", () => {
  let refreshTokenCookie = "";
  let accessTokenCookie = "";

  test("POST /api/v1/auth/register", async () => {
    const payload = {
      nama: "Admin Baru",
      email: "adminbaru@gmail.com",
      password: "@Ahazain123",
      no_wa: "081234567890",
      role: "ADMIN",
    };

    const result = passwordStrengthTest.test(payload.password);
    expect(result.strong).toBe(true);

    const response = await supertest(app) //supertest itu seperti "simulasi postman otomatis" yang bisa mengirim request langsung ke app-nya Express — tanpa benar-benar membuat server hidup.
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
      email: "adminbaru@gmail.com",
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
