import type {
  DownloadTokenResponse,
  ErrorResponse,
  PluginListResponse,
  PluginVersionResponse
} from "@pluginadaptix/shared";
import type { NextFunction, Request, RequestHandler, Response } from "express";

import { PluginService, PluginServiceError } from "../services/plugin.service.js";
import {
  validateDownloadTokenBody,
  validatePluginListQuery,
  validatePluginVersionQuery
} from "../validators/plugin.validator.js";

export function getPluginVersion(service: PluginService): RequestHandler {
  return async (
    request: Request,
    response: Response<PluginVersionResponse | ErrorResponse>,
    next: NextFunction
  ): Promise<void> => {
    const validation = validatePluginVersionQuery(request.query);

    if (!validation.success) {
      response.status(validation.status).json(validation.response);
      return;
    }

    try {
      const result = await service.getVersion(validation.data);
      response.status(200).json(result);
    } catch (error) {
      if (error instanceof PluginServiceError) {
        response.status(error.status).json(error.response);
        return;
      }

      next(error);
    }
  };
}

export function listPlugins(service: PluginService): RequestHandler {
  return async (
    request: Request,
    response: Response<PluginListResponse | ErrorResponse>,
    next: NextFunction
  ): Promise<void> => {
    const validation = validatePluginListQuery(request.query);

    if (!validation.success) {
      response.status(validation.status).json(validation.response);
      return;
    }

    try {
      const result = await service.listPlugins(validation.data);
      response.status(200).json(result);
    } catch (error) {
      if (error instanceof PluginServiceError) {
        response.status(error.status).json(error.response);
        return;
      }

      next(error);
    }
  };
}

export function createDownloadToken(service: PluginService): RequestHandler {
  return async (
    request: Request,
    response: Response<DownloadTokenResponse | ErrorResponse>,
    next: NextFunction
  ): Promise<void> => {
    const validation = validateDownloadTokenBody(request.body);

    if (!validation.success) {
      response.status(validation.status).json(validation.response);
      return;
    }

    try {
      const userAgent = request.get("user-agent");
      const result = await service.createDownloadToken(validation.data, {
        ...(request.ip !== undefined ? { ipAddress: request.ip } : {}),
        ...(userAgent !== undefined ? { userAgent } : {})
      });
      response.status(200).json(result);
    } catch (error) {
      if (error instanceof PluginServiceError) {
        response.status(error.status).json(error.response);
        return;
      }

      next(error);
    }
  };
}
