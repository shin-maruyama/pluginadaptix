import { SUCCESS_CODES, type HealthResponse } from "@pluginadaptix/shared";
import type { Request, Response } from "express";

export function getHealth(_request: Request, response: Response<HealthResponse>): void {
  response.status(200).json({
    success: true,
    code: SUCCESS_CODES.HEALTHY,
    message: "API is running.",
    data: {
      status: "ok",
      timestamp: new Date().toISOString()
    }
  });
}
