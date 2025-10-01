/// <reference types="jest" />
import request from "supertest";
import app from "../src/app";

describe("Auth routes", () => {
  let token: string;
  const testUser = {
    name: "Test User",
    email: "test@example.com",
    password: "password123",
  };

  // Signup user before all tests
  beforeAll(async () => {
    const res = await request(app).post("/auth/signup").send(testUser);
    token = res.body.token;
  });

  // Cleanup user after all tests
  afterAll(async () => {
    await request(app)
      .delete("/auth/delete")
      .set("Authorization", `Bearer ${token}`);
  });

  it("should fail signup with missing fields", async () => {
    const res = await request(app).post("/auth/signup").send({});
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Name, email, and password are required");
  });

  it("should login the user", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: testUser.email, password: testUser.password });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    token = res.body.token; // update token after login
  });

  it("should get user profile", async () => {
    const res = await request(app)
      .get("/auth/profile")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.email).toBe(testUser.email);
  });
});
