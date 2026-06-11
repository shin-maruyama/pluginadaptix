import type {
  ErrorResponse,
  LicenseAuthenticateResponse,
  LicenseDeactivateResponse,
  LicenseStatusResponse
} from "@pluginadaptix/shared";
import type { NextFunction, Request, RequestHandler, Response } from "express";

import { LicenseService, LicenseServiceError } from "../services/license.service.js";
import {
  validateLicenseAuthenticateRequest,
  validateLicenseDeactivateRequest,
  validateLicenseStatusQuery
} from "../validators/license.validator.js";

export function authenticateLicense(service: LicenseService): RequestHandler {
  return async (
    request: Request,
    response: Response<LicenseAuthenticateResponse | ErrorResponse>,
    next: NextFunction
  ): Promise<void> => {
    const validation = validateLicenseAuthenticateRequest(request.body);

    if (!validation.success) {
      response.status(validation.status).json(validation.response);
      return;
    }

    try {
      const userAgent = request.header("User-Agent");
      const result = await service.authenticate(validation.data, {
        ...(request.ip !== undefined ? { ipAddress: request.ip } : {}),
        ...(userAgent !== undefined ? { userAgent } : {})
      });
      response.status(200).json(result);
    } catch (error) {
      if (error instanceof LicenseServiceError) {
        response.status(error.status).json(error.response);
        return;
      }

      next(error);
    }
  };
}

export function getLicenseStatus(service: LicenseService): RequestHandler {
  return async (
    request: Request,
    response: Response<LicenseStatusResponse | ErrorResponse>,
    next: NextFunction
  ): Promise<void> => {
    const validation = validateLicenseStatusQuery(request.query);

    if (!validation.success) {
      response.status(validation.status).json(validation.response);
      return;
    }

    try {
      const userAgent = request.header("User-Agent");
      const result = await service.getStatus(validation.data, {
        ...(request.ip !== undefined ? { ipAddress: request.ip } : {}),
        ...(userAgent !== undefined ? { userAgent } : {})
      });
      response.status(200).json(result);
    } catch (error) {
      if (error instanceof LicenseServiceError) {
        response.status(error.status).json(error.response);
        return;
      }

      next(error);
    }
  };
}

export function deactivateLicense(service: LicenseService): RequestHandler {
  return async (
    request: Request,
    response: Response<LicenseDeactivateResponse | ErrorResponse>,
    next: NextFunction
  ): Promise<void> => {
    const validation = validateLicenseDeactivateRequest(request.body);

    if (!validation.success) {
      response.status(validation.status).json(validation.response);
      return;
    }

    try {
      const userAgent = request.header("User-Agent");
      const result = await service.deactivate(validation.data, {
        ...(request.ip !== undefined ? { ipAddress: request.ip } : {}),
        ...(userAgent !== undefined ? { userAgent } : {})
      });
      response.status(200).json(result);
    } catch (error) {
      if (error instanceof LicenseServiceError) {
        response.status(error.status).json(error.response);
        return;
      }

      next(error);
    }
  };
}
