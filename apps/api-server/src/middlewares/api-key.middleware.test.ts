import express from "express";
import { describe, expect, it, vi } from "vitest";
import request from "supertest";

import { createApiKeyMiddleware } from "./api-key.middleware.js";

describe("createApiKeyMiddleware", () => {
  it("rejects requests with an invalid API key", async () => {
    const app = express();
    app.get("/protected", createApiKeyMiddleware("secret"), (_request, response) => {
      response.status(204).send();
    });

    const response = await request(app).get("/protected").set("X-API-Key", "wrong").expect(401);

    expect(response.body).toEqual({
      success: false,
      code: "INVALID_API_KEY",
      message: "Invalid API key.",
      data: null
    });
  });

  it("passes requests with a valid API key", async () => {
    const handler = vi.fn((_request, response: express.Response) => {
      response.status(204).send();
    });
    const app = express();
    app.get("/protected", createApiKeyMiddleware("secret"), handler);

    await request(app).get("/protected").set("X-API-Key", "secret").expect(204);

    expect(handler).toHaveBeenCalledOnce();
  });
});
