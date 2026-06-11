import { describe, expect, it } from "vitest";
import request from "supertest";

import { createApp } from "../app.js";

describe("GET /v1/health", () => {
  it("returns the OpenAPI health response shape", async () => {
    const app = createApp();

    const response = await request(app).get("/v1/health").expect(200);

    expect(response.body).toMatchObject({
      success: true,
      code: "HEALTHY",
      message: "API is running.",
      data: {
        status: "ok"
      }
    });
    expect(typeof response.body.data.timestamp).toBe("string");
    expect(Date.parse(response.body.data.timestamp)).not.toBeNaN();
  });
});
