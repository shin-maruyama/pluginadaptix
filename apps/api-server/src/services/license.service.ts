import {
  ERROR_CODES,
  SUCCESS_CODES,
  type ErrorCode,
  type ErrorResponse,
  type LicenseAuthenticateData,
  type LicenseAuthenticateRequest,
  type LicenseAuthenticateResponse,
  type LicenseDeactivateRequest,
  type LicenseDeactivateResponse,
  type LicenseStatusQuery,
  type LicenseStatusResponse
} from "@pluginadaptix/shared";

import type { AuthLogInput, LicenseRepository } from "../repositories/license.repository.js";
import { createLicenseKeyHash, maskLicenseKey } from "../utils/license-key.js";

const ACTIVE_STATUS_VALUES = new Set(["active", "ACTIVE", "有効"]);
const SUSPENDED_STATUS_VALUES = new Set(["suspended", "SUSPENDED", "停止"]);
const EXPIRED_STATUS_VALUES = new Set(["expired", "EXPIRED", "期限切れ"]);
const CONTRACT_ACTIVE_STATUS_VALUES = new Set(["active", "ACTIVE", "有効"]);

export interface RequestContext {
  ipAddress?: string;
  userAgent?: string;
}

export class LicenseServiceError extends Error {
  public readonly status: number;
  public readonly response: ErrorResponse<null, ErrorCode>;

  public constructor(status: number, response: ErrorResponse<null, ErrorCode>) {
    super(response.message);
    this.name = "LicenseServiceError";
    this.status = status;
    this.response = response;
  }
}

export class LicenseService {
  public constructor(private readonly repository: LicenseRepository) {}

  public async authenticate(
    request: LicenseAuthenticateRequest,
    context: RequestContext = {}
  ): Promise<LicenseAuthenticateResponse> {
    try {
      const data = await this.authenticateOrThrow(request);
      await this.writeAuthLog(request, context, "success", "License authentication succeeded.");

      return {
        success: true,
        code: SUCCESS_CODES.LICENSE_ACTIVE,
        message: "License authentication succeeded.",
        data
      };
    } catch (error) {
      if (error instanceof LicenseServiceError) {
        await this.writeAuthLog(request, context, "failure", error.response.code);
      }

      throw error;
    }
  }

  public async getStatus(
    query: LicenseStatusQuery,
    context: RequestContext = {}
  ): Promise<LicenseStatusResponse> {
    try {
      const data = await this.getStatusOrThrow(query);
      await this.writeStatusLog(query, context, "success", "License status checked.");

      return {
        success: true,
        code: SUCCESS_CODES.LICENSE_ACTIVE,
        message: "License is active.",
        data
      };
    } catch (error) {
      if (error instanceof LicenseServiceError) {
        await this.writeStatusLog(query, context, "failure", error.response.code);
      }

      throw error;
    }
  }

  public async deactivate(
    request: LicenseDeactivateRequest,
    context: RequestContext = {}
  ): Promise<LicenseDeactivateResponse> {
    try {
      const data = await this.deactivateOrThrow(request);
      await this.writeDeactivateLog(request, context, "success", "License domain deactivated.");

      return {
        success: true,
        code: SUCCESS_CODES.LICENSE_DEACTIVATED,
        message: "License domain deactivated.",
        data
      };
    } catch (error) {
      if (error instanceof LicenseServiceError) {
        await this.writeDeactivateLog(request, context, "failure", error.response.code);
      }

      throw error;
    }
  }

  private async authenticateOrThrow(
    request: LicenseAuthenticateRequest
  ): Promise<LicenseAuthenticateData> {
    const licenseKeyHash = createLicenseKeyHash(request.licenseKey);
    const license = await this.repository.findLicenseByLicenseKeyHash(licenseKeyHash);

    if (license === undefined) {
      throw this.createError(401, ERROR_CODES.INVALID_LICENSE_KEY, "Invalid license key.");
    }

    if (license.pluginId !== request.pluginId) {
      throw this.createError(403, ERROR_CODES.PLUGIN_NOT_ALLOWED, "Plugin is not allowed.");
    }

    if (SUSPENDED_STATUS_VALUES.has(license.licenseStatus)) {
      throw this.createError(403, ERROR_CODES.LICENSE_SUSPENDED, "License is suspended.");
    }

    if (EXPIRED_STATUS_VALUES.has(license.licenseStatus) || isPastDate(license.expireDate)) {
      throw this.createError(403, ERROR_CODES.LICENSE_EXPIRED, "License has expired.");
    }

    if (!ACTIVE_STATUS_VALUES.has(license.licenseStatus)) {
      throw this.createError(401, ERROR_CODES.INVALID_LICENSE_KEY, "License is not active.");
    }

    const contract = await this.repository.findContractById(license.contractId);

    if (contract === undefined) {
      throw this.createError(404, ERROR_CODES.CONTRACT_NOT_FOUND, "Contract was not found.");
    }

    if (!CONTRACT_ACTIVE_STATUS_VALUES.has(contract.contractStatus) || isPastDate(contract.contractEnd)) {
      throw this.createError(403, ERROR_CODES.CONTRACT_EXPIRED, "Contract has expired.");
    }

    const plugin = await this.repository.findPluginById(license.pluginId);

    if (plugin === undefined) {
      throw this.createError(404, ERROR_CODES.PLUGIN_NOT_FOUND, "Plugin was not found.");
    }

    const registeredDomains = await this.repository.findRegisteredDomainsByLicenseId(license.licenseId);
    const hasDomain = registeredDomains.some(
      (domain) => domain.kintoneDomain === request.kintoneDomain && isActiveDomain(domain.domainStatus)
    );

    if (!hasDomain && registeredDomains.length >= license.maxDomainCount) {
      throw this.createError(403, ERROR_CODES.DOMAIN_LIMIT_EXCEEDED, "Domain limit exceeded.");
    }

    if (!hasDomain) {
      await this.repository.addRegisteredDomain({
        licenseId: license.licenseId,
        licenseKey: maskLicenseKey(request.licenseKey),
        kintoneDomain: request.kintoneDomain,
        ...(request.appId !== undefined ? { appId: request.appId } : {}),
        ...(request.environment !== undefined ? { environment: request.environment } : {})
      });
    }

    const currentDomainCount = hasDomain ? registeredDomains.length : registeredDomains.length + 1;
    await this.repository.updateLicenseAuthResult(license.licenseId, {
      currentDomainCount,
      lastAuthResult: "success"
    });

    return {
      licenseId: license.licenseId,
      licenseStatus: license.licenseStatus,
      contractStatus: contract.contractStatus,
      pluginId: plugin.pluginId,
      pluginName: plugin.pluginName,
      expireDate: license.expireDate,
      registeredDomain: request.kintoneDomain,
      maxDomains: license.maxDomainCount,
      currentDomains: currentDomainCount
    };
  }

  private createError(status: number, code: ErrorCode, message: string): LicenseServiceError {
    return new LicenseServiceError(status, {
      success: false,
      code,
      message,
      data: null
    });
  }

  private async getStatusOrThrow(query: LicenseStatusQuery): Promise<LicenseStatusResponse["data"]> {
    const license = await this.repository.findLicenseByLicenseKeyHash(
      createLicenseKeyHash(query.licenseKey)
    );

    if (license === undefined) {
      throw this.createError(404, ERROR_CODES.LICENSE_NOT_FOUND, "License was not found.");
    }

    if (license.pluginId !== query.pluginId) {
      throw this.createError(403, ERROR_CODES.PLUGIN_MISMATCH, "Plugin does not match.");
    }

    if (SUSPENDED_STATUS_VALUES.has(license.licenseStatus)) {
      throw this.createError(403, ERROR_CODES.LICENSE_SUSPENDED, "License is suspended.");
    }

    if (EXPIRED_STATUS_VALUES.has(license.licenseStatus) || isPastDate(license.expireDate)) {
      throw this.createError(403, ERROR_CODES.LICENSE_EXPIRED, "License has expired.");
    }

    if (!ACTIVE_STATUS_VALUES.has(license.licenseStatus)) {
      throw this.createError(403, ERROR_CODES.INVALID_LICENSE_KEY, "License is not active.");
    }

    const registeredDomains = await this.repository.findRegisteredDomainsByLicenseId(license.licenseId);
    const hasDomain = registeredDomains.some(
      (domain) => domain.kintoneDomain === query.kintoneDomain && isActiveDomain(domain.domainStatus)
    );

    if (!hasDomain) {
      throw this.createError(403, ERROR_CODES.DOMAIN_MISMATCH, "Domain does not match.");
    }

    const contract = await this.repository.findContractById(license.contractId);

    if (contract === undefined) {
      throw this.createError(404, ERROR_CODES.CONTRACT_NOT_FOUND, "Contract was not found.");
    }

    if (!CONTRACT_ACTIVE_STATUS_VALUES.has(contract.contractStatus) || isPastDate(contract.contractEnd)) {
      throw this.createError(403, ERROR_CODES.CONTRACT_EXPIRED, "Contract has expired.");
    }

    await this.repository.updateLicenseAuthResult(license.licenseId, {
      lastAuthResult: "success"
    });

    return {
      licenseStatus: license.licenseStatus,
      expireDate: license.expireDate,
      daysRemaining: calculateDaysRemaining(license.expireDate),
      available: true
    };
  }

  private async deactivateOrThrow(
    request: LicenseDeactivateRequest
  ): Promise<LicenseDeactivateResponse["data"]> {
    const license = await this.repository.findLicenseByLicenseKeyHash(
      createLicenseKeyHash(request.licenseKey)
    );

    if (license === undefined) {
      throw this.createError(404, ERROR_CODES.LICENSE_NOT_FOUND, "License was not found.");
    }

    if (license.pluginId !== request.pluginId) {
      throw this.createError(403, ERROR_CODES.PLUGIN_MISMATCH, "Plugin does not match.");
    }

    const registeredDomains = await this.repository.findRegisteredDomainsByLicenseId(license.licenseId);
    const targetDomain = registeredDomains.find(
      (domain) => domain.kintoneDomain === request.kintoneDomain && isActiveDomain(domain.domainStatus)
    );

    if (targetDomain === undefined) {
      throw this.createError(403, ERROR_CODES.DOMAIN_MISMATCH, "Domain does not match.");
    }

    await this.repository.updateRegisteredDomainStatus(targetDomain.domainId, "deactivated");

    const activeDomainCount = registeredDomains.filter((domain) => isActiveDomain(domain.domainStatus)).length;
    await this.repository.updateLicenseAuthResult(license.licenseId, {
      currentDomainCount: Math.max(0, activeDomainCount - 1),
      lastAuthResult: "deactivated"
    });

    return {
      licenseStatus: "inactive",
      deactivatedAt: new Date().toISOString()
    };
  }

  private async writeAuthLog(
    request: LicenseAuthenticateRequest,
    context: RequestContext,
    result: AuthLogInput["resultStatus"],
    message: string
  ): Promise<void> {
    await this.repository.addAuthLog({
      eventType: "authenticate",
      resultStatus: result,
      licenseKey: maskLicenseKey(request.licenseKey),
      pluginId: request.pluginId,
      pluginVersion: request.pluginVersion,
      kintoneDomain: request.kintoneDomain,
      message,
      ...(request.appId !== undefined ? { appId: request.appId } : {}),
      ...(context.ipAddress !== undefined ? { ipAddress: context.ipAddress } : {}),
      ...(context.userAgent !== undefined ? { userAgent: context.userAgent } : {})
    });
  }

  private async writeStatusLog(
    query: LicenseStatusQuery,
    context: RequestContext,
    result: AuthLogInput["resultStatus"],
    message: string
  ): Promise<void> {
    await this.repository.addAuthLog({
      eventType: "status",
      resultStatus: result,
      licenseKey: maskLicenseKey(query.licenseKey),
      pluginId: query.pluginId,
      kintoneDomain: query.kintoneDomain,
      message,
      ...(context.ipAddress !== undefined ? { ipAddress: context.ipAddress } : {}),
      ...(context.userAgent !== undefined ? { userAgent: context.userAgent } : {})
    });
  }

  private async writeDeactivateLog(
    request: LicenseDeactivateRequest,
    context: RequestContext,
    result: AuthLogInput["resultStatus"],
    message: string
  ): Promise<void> {
    await this.repository.addAuthLog({
      eventType: "deactivate",
      resultStatus: result,
      licenseKey: maskLicenseKey(request.licenseKey),
      pluginId: request.pluginId,
      kintoneDomain: request.kintoneDomain,
      message,
      ...(context.ipAddress !== undefined ? { ipAddress: context.ipAddress } : {}),
      ...(context.userAgent !== undefined ? { userAgent: context.userAgent } : {})
    });
  }
}

function isPastDate(dateValue: string): boolean {
  const dateTime = Date.parse(`${dateValue}T23:59:59.999Z`);

  if (Number.isNaN(dateTime)) {
    return false;
  }

  return dateTime < Date.now();
}

function calculateDaysRemaining(dateValue: string): number {
  const expireTime = Date.parse(`${dateValue}T23:59:59.999Z`);

  if (Number.isNaN(expireTime)) {
    return 0;
  }

  const millisecondsRemaining = expireTime - Date.now();
  return Math.max(0, Math.ceil(millisecondsRemaining / 86_400_000));
}

function isActiveDomain(domainStatus: string): boolean {
  return !["inactive", "deactivated", "解除"].includes(domainStatus);
}
