import request from "supertest";
import app from "../src/server"; // export app instead of listen in server.ts

describe("Task API", () => {
  it("should create a task", async () => {
    const res = await request(app).post("/tasks").send({
      title: "Test Task",
      priority: "low",
      status: "pending",
    });
    expect(res.status).toBe(201);
    expect(res.body.title).toBe("Test Task");
  });
});