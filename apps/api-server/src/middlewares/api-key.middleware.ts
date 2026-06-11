import { ERROR_CODES, type ErrorResponse } from "@pluginadaptix/shared";
import type { NextFunction, Request, RequestHandler, Response } from "express";

export function createApiKeyMiddleware(expectedApiKey: string): RequestHandler {
  if (expectedApiKey.trim().length === 0) {
    throw new Error("API_KEY is required.");
  }

  return (request: Request, response: Response<ErrorResponse>, next: NextFunction): void => {
    const apiKey = request.header("X-API-Key");

    if (apiKey !== expectedApiKey) {
      response.status(401).json({
        success: false,
        code: ERROR_CODES.INVALID_API_KEY,
        message: "Invalid API key.",
        data: null
      });
      return;
    }

    next();
  };
}
