import request from "supertest";
import app from "../src/server";

let token: string;

beforeAll(async () => {
  // Register a user
  await request(app).post("/register").send({
    username: "testuser",
    email: "test@example.com",
    firstName: "Test",
    lastName: "User",
    password: "password123",
  });

  // Login to get JWT
  const loginRes = await request(app).post("/login").send({
    identifier: "testuser",
    password: "password123",
  });
  token = loginRes.body.token;
});

describe("Auth API", () => {
  it("should not allow duplicate registration", async () => {
    const res = await request(app).post("/register").send({
      username: "testuser",
      email: "test@example.com",
      firstName: "Test",
      lastName: "User",
      password: "password123",
    });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("User already exists");
  });

  it("should reject invalid login", async () => {
    const res = await request(app).post("/login").send({
      identifier: "wronguser",
      password: "password123",
    });
    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Invalid credentials");
  });
});

describe("Task API", () => {
  it("should return empty tasks initially", async () => {
    const res = await request(app)
      .get("/tasks")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("should create a task", async () => {
    const res = await request(app)
      .post("/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test Task",
        priority: "low",
        status: "pending",
      });
    expect(res.status).toBe(201);
    expect(res.body.title).toBe("Test Task");
  });

  it("should update a task", async () => {
    const createRes = await request(app)
      .post("/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Another Task",
        priority: "high",
        status: "pending",
      });

    const res = await request(app)
      .patch(`/tasks/${createRes.body.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ status: "completed" });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("completed");
  });

  it("should delete a task", async () => {
    const createRes = await request(app)
      .post("/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Task to Delete",
        priority: "medium",
        status: "pending",
      });

    const res = await request(app)
      .delete(`/tasks/${createRes.body.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(204);
  });

  it("should return 404 for unknown route", async () => {
    const res = await request(app).get("/unknown");
    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Route not found");
  });
});
