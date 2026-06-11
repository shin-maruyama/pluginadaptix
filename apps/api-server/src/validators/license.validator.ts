import {
  ERROR_CODES,
  type ErrorResponse,
  type LicenseAuthenticateRequest,
  type LicenseDeactivateRequest,
  type LicenseStatusQuery
} from "@pluginadaptix/shared";

interface AuthenticateValidationSuccess {
  success: true;
  data: LicenseAuthenticateRequest;
}

interface ValidationFailure {
  success: false;
  status: number;
  response: ErrorResponse<null, "INVALID_REQUEST">;
}

export type LicenseAuthenticateValidationResult = AuthenticateValidationSuccess | ValidationFailure;

interface StatusValidationSuccess {
  success: true;
  data: LicenseStatusQuery;
}

export type LicenseStatusValidationResult = StatusValidationSuccess | ValidationFailure;

interface DeactivateValidationSuccess {
  success: true;
  data: LicenseDeactivateRequest;
}

export type LicenseDeactivateValidationResult = DeactivateValidationSuccess | ValidationFailure;

export function validateLicenseAuthenticateRequest(body: unknown): LicenseAuthenticateValidationResult {
  if (!isRecord(body)) {
    return invalidRequest("Request body must be a JSON object.");
  }

  const licenseKey = getRequiredString(body, "licenseKey");
  const pluginId = getRequiredString(body, "pluginId");
  const pluginVersion = getRequiredString(body, "pluginVersion");
  const kintoneDomain = getRequiredString(body, "kintoneDomain");

  if (
    licenseKey === undefined ||
    pluginId === undefined ||
    pluginVersion === undefined ||
    kintoneDomain === undefined
  ) {
    return invalidRequest("licenseKey, pluginId, pluginVersion, and kintoneDomain are required.");
  }

  const companyName = getOptionalString(body, "companyName");
  const appId = getOptionalString(body, "appId");
  const environment = getOptionalEnvironment(body, "environment");

  if (companyName === false || appId === false || environment === false) {
    return invalidRequest("Optional fields must match their expected types.");
  }

  return {
    success: true,
    data: {
      licenseKey,
      pluginId,
      pluginVersion,
      kintoneDomain,
      ...(companyName !== undefined ? { companyName } : {}),
      ...(appId !== undefined ? { appId } : {}),
      ...(environment !== undefined ? { environment } : {})
    }
  };
}

export function validateLicenseStatusQuery(query: unknown): LicenseStatusValidationResult {
  if (!isRecord(query)) {
    return invalidRequest("Query parameters must be an object.");
  }

  const licenseKey = getRequiredString(query, "licenseKey");
  const pluginId = getRequiredString(query, "pluginId");
  const kintoneDomain = getRequiredString(query, "kintoneDomain");

  if (licenseKey === undefined || pluginId === undefined || kintoneDomain === undefined) {
    return invalidRequest("licenseKey, pluginId, and kintoneDomain are required.");
  }

  return {
    success: true,
    data: {
      licenseKey,
      pluginId,
      kintoneDomain
    }
  };
}

export function validateLicenseDeactivateRequest(body: unknown): LicenseDeactivateValidationResult {
  if (!isRecord(body)) {
    return invalidRequest("Request body must be a JSON object.");
  }

  const licenseKey = getRequiredString(body, "licenseKey");
  const pluginId = getRequiredString(body, "pluginId");
  const kintoneDomain = getRequiredString(body, "kintoneDomain");

  if (licenseKey === undefined || pluginId === undefined || kintoneDomain === undefined) {
    return invalidRequest("licenseKey, pluginId, and kintoneDomain are required.");
  }

  const reason = getOptionalString(body, "reason");

  if (reason === false) {
    return invalidRequest("Optional fields must match their expected types.");
  }

  return {
    success: true,
    data: {
      licenseKey,
      pluginId,
      kintoneDomain,
      ...(reason !== undefined ? { reason } : {})
    }
  };
}

function invalidRequest(message: string): ValidationFailure {
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

function getOptionalString(source: Record<string, unknown>, field: string): string | undefined | false {
  const value = source[field];

  if (value === undefined) {
    return undefined;
  }

  return typeof value === "string" ? value.trim() : false;
}

function getOptionalEnvironment(
  source: Record<string, unknown>,
  field: string
): "production" | "sandbox" | undefined | false {
  const value = source[field];

  if (value === undefined) {
    return undefined;
  }

  if (value === "production" || value === "sandbox") {
    return value;
  }

  return false;
}
