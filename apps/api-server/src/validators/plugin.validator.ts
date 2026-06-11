import {
  ERROR_CODES,
  type DownloadTokenRequest,
  type ErrorResponse,
  type PluginListQuery,
  type PluginVersionQuery
} from "@pluginadaptix/shared";

interface PluginVersionValidationSuccess {
  success: true;
  data: PluginVersionQuery;
}

interface PluginVersionValidationFailure {
  success: false;
  status: number;
  response: ErrorResponse<null, "INVALID_REQUEST">;
}

export type PluginVersionValidationResult =
  | PluginVersionValidationSuccess
  | PluginVersionValidationFailure;

interface PluginListValidationSuccess {
  success: true;
  data: PluginListQuery;
}

export type PluginListValidationResult = PluginListValidationSuccess | PluginVersionValidationFailure;

interface DownloadTokenValidationSuccess {
  success: true;
  data: DownloadTokenRequest;
}

export type DownloadTokenValidationResult =
  | DownloadTokenValidationSuccess
  | PluginVersionValidationFailure;

export function validatePluginVersionQuery(query: unknown): PluginVersionValidationResult {
  if (!isRecord(query)) {
    return invalidRequest("Query parameters must be an object.");
  }

  const pluginId = getRequiredString(query, "pluginId");
  const currentVersion = getRequiredString(query, "currentVersion");

  if (pluginId === undefined || currentVersion === undefined) {
    return invalidRequest("pluginId and currentVersion are required.");
  }

  return {
    success: true,
    data: {
      pluginId,
      currentVersion
    }
  };
}

export function validatePluginListQuery(query: unknown): PluginListValidationResult {
  if (!isRecord(query)) {
    return invalidRequest("Query parameters must be an object.");
  }

  const memberId = getRequiredString(query, "memberId");

  if (memberId === undefined) {
    return invalidRequest("memberId is required.");
  }

  return {
    success: true,
    data: {
      memberId
    }
  };
}

export function validateDownloadTokenBody(body: unknown): DownloadTokenValidationResult {
  if (!isRecord(body)) {
    return invalidRequest("Request body must be an object.");
  }

  const memberId = getRequiredString(body, "memberId");
  const pluginId = getRequiredString(body, "pluginId");
  const licenseKey = getRequiredString(body, "licenseKey");

  if (memberId === undefined || pluginId === undefined || licenseKey === undefined) {
    return invalidRequest("memberId, pluginId and licenseKey are required.");
  }

  return {
    success: true,
    data: {
      memberId,
      pluginId,
      licenseKey
    }
  };
}

function invalidRequest(message: string): PluginVersionValidationFailure {
  return {
    success: false,
    status: 400,
    response: {
      success: false,
      code: ERROR_CODES.INVALID_REQUEST,
      message,
      data: null
    }
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getRequiredString(source: Record<string, unknown>, field: string): string | undefined {
  const value = source[field];
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : undefined;
}
