import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import app from "../server.js";

describe("Server API", () => {
  describe("GET /health", () => {
    it("should return health status", async () => {
      const response = await request(app)
        .get("/health")
        .expect(200);

      expect(response.body).toHaveProperty("status", "OK");
      expect(response.body).toHaveProperty("timestamp");
      expect(response.body).toHaveProperty("uptime");
      expect(response.body).toHaveProperty("environment");
    });
  });

  describe("GET /api", () => {
    it("should return API information", async () => {
      const response = await request(app)
        .get("/api")
        .expect(200);

      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toContain("MERN API is running");
    });
  });

  describe("GET /api/users", () => {
    it("should return users list", async () => {
      const response = await request(app)
        .get("/api/users")
        .expect(200);

      expect(response.body).toHaveProperty("users");
      expect(Array.isArray(response.body.users)).toBe(true);
    });
  });

  describe("GET /nonexistent", () => {
    it("should return 404 for non-existent routes", async () => {
      const response = await request(app)
        .get("/nonexistent")
        .expect(404);

      expect(response.body).toHaveProperty("message");
    });
  });
});