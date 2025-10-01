/// <reference types="jest" />
import request from "supertest";
import app from "../src/index";

describe("Auth routes", () => {
  let token: string;

  it("should fail signup with missing fields", async () => {
    const res = await request(app).post("/auth/signup").send({});
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Name, email, and password are required");
  });

  it("should signup a new user", async () => {
    const res = await request(app)
      .post("/auth/signup")
      .send({ name: "Test User", email: "test@example.com", password: "password123" });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    token = res.body.token;
  });

  it("should login the user", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "test@example.com", password: "password123" });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    token = res.body.token;
  });

  it("should get user profile", async () => {
    const res = await request(app)
      .get("/auth/profile")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.email).toBe("test@example.com");
  });

  it("should delete the user", async () => {
    const res = await request(app)
      .delete("/auth/delete")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("User deleted successfully.");
  });
});
