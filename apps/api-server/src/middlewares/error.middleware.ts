import { ERROR_CODES, type ErrorResponse } from "@pluginadaptix/shared";
import type { NextFunction, Request, Response } from "express";

export function errorMiddleware(
  error: unknown,
  _request: Request,
  response: Response<ErrorResponse>,
  _next: NextFunction
): void {
  const message = error instanceof Error ? error.message : "Internal server error.";

  response.status(500).json({
    success: false,
    code: ERROR_CODES.INTERNAL_SERVER_ERROR,
    message,
    data: null
  });
}
