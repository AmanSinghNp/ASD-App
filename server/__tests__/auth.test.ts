import request from "supertest";
import app from "../src/app"; // exports your Express app

describe("Auth routes", () => {
  let token: string;

  const testUser = {
    name: "Test User",
    email: "test@example.com",
    password: "password123",
  };

  // Signup before all tests
  beforeAll(async () => {
    const res = await request(app).post("/auth/signup").send(testUser);
    token = res.body.token;
  });

  // // Delete user after all tests
  // afterAll(async () => {
  //   await request(app)
  //     .delete("/auth/delete")
  //     .set("Authorization", `Bearer ${token}`);
  // });

  // it("should fail signup with missing fields", async () => {
  //   const res = await request(app).post("/auth/signup").send({});
  //   expect(res.status).toBe(400);
  //   expect(res.body.message).toBe("Name, email, and password are required");
  // });

  it("should login the user", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: testUser.email, password: testUser.password });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    token = res.body.token;
  });

  it("should get user profile", async () => {
    const res = await request(app)
      .get("/auth/profile")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.email).toBe(testUser.email);
  });

  it("should update user profile", async () => {
    // const newName = "Updated Name";
    // const newEmail = "updated@example.com";

    // const res = await request(app)
    //   .put("/auth/profile")
    //   .set("Authorization", `Bearer ${token}`)
    //   .send({ name: newName, email: newEmail });

    // expect(res.status).toBe(200);
    // expect(res.body.updatedUser.name).toBe(newName);
    // expect(res.body.updatedUser.email).toBe(newEmail);
    // expect(res.body).toHaveProperty("token");

    // // update token for further tests
    // token = res.body.token;
    // testUser.email = newEmail;
    
    // 1. Signup/login to get a token
    const signupRes = await request(app)
      .post("/auth/login")
      .send({ name: "Test", email: "test@example.com", password: "password123" });

    const token = signupRes.body.token;

    // 2. Use the token to update profile
    const newName = "Updated Name";
    const newEmail = "updated@example.com";

    const res = await request(app)
      .put("/auth/profile")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: newName, email: newEmail });

    // 3. Assertions
    expect(res.status).toBe(200);
    expect(res.body.updatedUser.name).toBe(newName);
    expect(res.body.updatedUser.email).toBe(newEmail);
    expect(res.body).toHaveProperty("token"); // new token after update
  }, 10000);

  it("should return 401 for profile with invalid token", async () => {
    const res = await request(app)
      .get("/auth/profile")
      .set("Authorization", `Bearer invalidtoken`);
    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Invalid token");
  });

  it("should delete the user", async () => {
    const res = await request(app)
      .delete("/auth/delete")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("User deleted successfully.");
  });

  it("should return 401 when deleting with missing token", async () => {
    const res = await request(app).delete("/auth/delete");
    expect(res.status).toBe(401);
    expect(res.body.error).toBe("No token provided");
  });
});
