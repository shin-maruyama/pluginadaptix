import { randomBytes, randomUUID } from "node:crypto";

import {
  ERROR_CODES,
  SUCCESS_CODES,
  type DownloadTokenRequest,
  type DownloadTokenResponse,
  type ErrorCode,
  type ErrorResponse,
  type PluginListQuery,
  type PluginListResponse,
  type PluginVersionQuery,
  type PluginVersionResponse
} from "@pluginadaptix/shared";

import type { ContractEntity, LicenseEntity, PluginRepository } from "../repositories/plugin.repository.js";
import { createLicenseKeyHash } from "../utils/license-key.js";

const PUBLIC_PLUGIN_STATUSES = new Set(["public", "PUBLIC", "active", "ACTIVE", "公開", "有効"]);
const DISALLOWED_PLUGIN_STATUSES = new Set([
  "private",
  "PRIVATE",
  "archived",
  "ARCHIVED",
  "deprecated",
  "DEPRECATED",
  "非公開",
  "廃止"
]);
const RELEASED_VERSION_STATUSES = new Set(["published", "PUBLISHED", "public", "PUBLIC", "公開"]);
const FORCE_UPDATE_VALUES = new Set(["true", "TRUE", "1", "yes", "YES", "はい"]);
const DOWNLOAD_TOKEN_EXPIRES_IN_SECONDS = 300;
const DEFAULT_DOWNLOAD_BASE_URL = "http://localhost:3000";

export interface CreateDownloadTokenMetadata {
  ipAddress?: string;
  userAgent?: string;
}

export class PluginServiceError extends Error {
  public readonly status: number;
  public readonly response: ErrorResponse<null, ErrorCode>;

  public constructor(status: number, response: ErrorResponse<null, ErrorCode>) {
    super(response.message);
    this.name = "PluginServiceError";
    this.status = status;
    this.response = response;
  }
}

export class PluginService {
  public constructor(
    private readonly repository: PluginRepository,
    private readonly downloadBaseUrl: string = DEFAULT_DOWNLOAD_BASE_URL
  ) {}

  public async listPlugins(query: PluginListQuery): Promise<PluginListResponse> {
    const customer = await this.repository.findCustomerByMemberId(query.memberId);

    if (customer === undefined) {
      return {
        success: true,
        code: SUCCESS_CODES.PLUGIN_LIST_FOUND,
        message: "Plugin list found.",
        data: []
      };
    }

    const [contracts, licenses] = await Promise.all([
      this.repository.findContractsByCustomerId(customer.customerId),
      this.repository.findLicensesByCustomerId(customer.customerId)
    ]);
    const contractById = new Map(contracts.map((contract) => [contract.contractId, contract]));
    const items = await Promise.all(
      licenses.map(async (license) => {
        const contract = contractById.get(license.contractId);
        const plugin = await this.repository.findPluginById(license.pluginId);

        if (plugin === undefined || !isPublicPluginStatus(plugin.publishStatus)) {
          return undefined;
        }

        const downloadAvailable = isDownloadAvailable(license, contract);

        return {
          pluginId: plugin.pluginId,
          pluginName: plugin.pluginName,
          latestVersion: plugin.latestVersion,
          licenseStatus: license.licenseStatus,
          downloadAvailable
        };
      })
    );

    return {
      success: true,
      code: SUCCESS_CODES.PLUGIN_LIST_FOUND,
      message: "Plugin list found.",
      data: items.filter((item) => item !== undefined)
    };
  }

  public async getVersion(query: PluginVersionQuery): Promise<PluginVersionResponse> {
    const plugin = await this.repository.findPluginById(query.pluginId);

    if (plugin === undefined) {
      throw this.createError(404, ERROR_CODES.PLUGIN_NOT_FOUND, "Plugin was not found.");
    }

    if (!isPublicPluginStatus(plugin.publishStatus)) {
      throw this.createError(403, ERROR_CODES.PLUGIN_NOT_ALLOWED, "Plugin is not available.");
    }

    const latestVersion = await this.repository.findLatestPluginVersion(query.pluginId);

    if (latestVersion === undefined || !RELEASED_VERSION_STATUSES.has(latestVersion.releaseStatus)) {
      throw this.createError(404, ERROR_CODES.PLUGIN_NOT_FOUND, "Plugin version was not found.");
    }

    const forceUpdate =
      isForceUpdate(latestVersion.isForceUpdate) ||
      shouldForceUpdate(query.currentVersion, plugin.forceUpdateVersion);

    return {
      success: true,
      code: SUCCESS_CODES.VERSION_CHECKED,
      message: "Plugin version checked.",
      data: {
        pluginId: plugin.pluginId,
        currentVersion: query.currentVersion,
        latestVersion: latestVersion.version,
        updateRequired: compareVersions(query.currentVersion, latestVersion.version) < 0,
        forceUpdate,
        ...(latestVersion.releaseNote !== undefined ? { releaseNote: latestVersion.releaseNote } : {}),
        ...(latestVersion.releaseDate !== undefined ? { releasedAt: latestVersion.releaseDate } : {})
      }
    };
  }

  public async createDownloadToken(
    request: DownloadTokenRequest,
    metadata: CreateDownloadTokenMetadata = {}
  ): Promise<DownloadTokenResponse> {
    const customer = await this.repository.findCustomerByMemberId(request.memberId);

    if (customer === undefined) {
      throw this.createError(404, ERROR_CODES.CONTRACT_NOT_FOUND, "Customer contract was not found.");
    }

    const license = await this.repository.findLicenseByKeyHashAndPluginId(
      createLicenseKeyHash(request.licenseKey),
      request.pluginId
    );

    if (license === undefined || license.customerId !== customer.customerId) {
      throw this.createError(401, ERROR_CODES.INVALID_LICENSE_KEY, "License key is invalid.");
    }

    const [contracts, plugin] = await Promise.all([
      this.repository.findContractsByCustomerId(customer.customerId),
      this.repository.findPluginById(request.pluginId)
    ]);
    const contract = contracts.find((item) => item.contractId === license.contractId);

    if (contract === undefined) {
      throw this.createError(404, ERROR_CODES.CONTRACT_NOT_FOUND, "Contract was not found.");
    }

    if (!isActiveStatus(contract.contractStatus) || isPastDate(contract.contractEnd)) {
      throw this.createError(403, ERROR_CODES.CONTRACT_EXPIRED, "Contract is not active.");
    }

    if (!isActiveStatus(license.licenseStatus)) {
      throw this.createError(403, ERROR_CODES.LICENSE_SUSPENDED, "License is suspended.");
    }

    if (isPastDate(license.expireDate)) {
      throw this.createError(403, ERROR_CODES.LICENSE_EXPIRED, "License has expired.");
    }

    if (plugin === undefined) {
      throw this.createError(404, ERROR_CODES.PLUGIN_NOT_FOUND, "Plugin was not found.");
    }

    if (!isPublicPluginStatus(plugin.publishStatus)) {
      throw this.createError(403, ERROR_CODES.PLUGIN_NOT_ALLOWED, "Plugin is not available.");
    }

    const latestVersion = await this.repository.findLatestPluginVersion(request.pluginId);

    if (latestVersion === undefined || !RELEASED_VERSION_STATUSES.has(latestVersion.releaseStatus)) {
      throw this.createError(404, ERROR_CODES.PLUGIN_NOT_FOUND, "Plugin version was not found.");
    }

    const now = new Date();
    const expiresAt = new Date(now.getTime() + DOWNLOAD_TOKEN_EXPIRES_IN_SECONDS * 1000);
    const token = randomBytes(32).toString("base64url");

    await this.repository.addDownloadLog({
      downloadLogId: `DL-${randomUUID()}`,
      downloadDatetime: now.toISOString(),
      customerId: customer.customerId,
      pluginId: plugin.pluginId,
      versionId: latestVersion.versionId,
      version: latestVersion.version,
      downloadToken: token,
      tokenExpireAt: expiresAt.toISOString(),
      downloadResult: "success",
      ...(metadata.ipAddress !== undefined ? { ipAddress: metadata.ipAddress } : {}),
      ...(metadata.userAgent !== undefined ? { userAgent: metadata.userAgent } : {}),
      message: "Download token created."
    });

    return {
      success: true,
      code: SUCCESS_CODES.DOWNLOAD_TOKEN_CREATED,
      message: "Download token created.",
      data: {
        downloadUrl: `${this.downloadBaseUrl}/v1/plugins/download?token=${encodeURIComponent(token)}`,
        expiresIn: DOWNLOAD_TOKEN_EXPIRES_IN_SECONDS
      }
    };
  }

  private createError(status: number, code: ErrorCode, message: string): PluginServiceError {
    return new PluginServiceError(status, {
      success: false,
      code,
      message,
      data: null
    });
  }
}

function isDownloadAvailable(license: LicenseEntity, contract: ContractEntity | undefined): boolean {
  if (contract === undefined) {
    return false;
  }

  return (
    isActiveStatus(license.licenseStatus) &&
    !isPastDate(license.expireDate) &&
    isActiveStatus(contract.contractStatus) &&
    !isPastDate(contract.contractEnd)
  );
}

function isActiveStatus(status: string): boolean {
  return ["active", "ACTIVE", "有効"].includes(status);
}

function isPastDate(dateValue: string): boolean {
  const dateTime = Date.parse(`${dateValue}T23:59:59.999Z`);

  if (Number.isNaN(dateTime)) {
    return false;
  }

  return dateTime < Date.now();
}

function isPublicPluginStatus(status: string): boolean {
  if (DISALLOWED_PLUGIN_STATUSES.has(status)) {
    return false;
  }

  return PUBLIC_PLUGIN_STATUSES.has(status);
}

function isForceUpdate(value: string | undefined): boolean {
  return value !== undefined && FORCE_UPDATE_VALUES.has(value);
}

function shouldForceUpdate(currentVersion: string, forceUpdateVersion: string | undefined): boolean {
  if (forceUpdateVersion === undefined || forceUpdateVersion.length === 0) {
    return false;
  }

  return compareVersions(currentVersion, forceUpdateVersion) < 0;
}

function compareVersions(left: string, right: string): number {
  const leftParts = parseVersion(left);
  const rightParts = parseVersion(right);
  const maxLength = Math.max(leftParts.length, rightParts.length);

  for (let index = 0; index < maxLength; index += 1) {
    const leftValue = leftParts[index] ?? 0;
    const rightValue = rightParts[index] ?? 0;

    if (leftValue < rightValue) {
      return -1;
    }

    if (leftValue > rightValue) {
      return 1;
    }
  }

  return 0;
}

function parseVersion(version: string): number[] {
  return version.split(".").map((part) => {
    const value = Number(part);
    return Number.isFinite(value) ? value : 0;
  });
}
