import type { ApiCode, ErrorCode, SuccessCode } from "../constants/error-codes.js";

export type DateString = string;
export type DateTimeString = string;
export type Environment = "production" | "sandbox";
export type AuthLogEventType = "authenticate" | "status" | "deactivate" | "download" | "error";
export type AuthLogResult = "success" | "failure" | "warning";

export interface ApiResponse<TData = unknown, TCode extends ApiCode = ApiCode> {
  success: boolean;
  code: TCode;
  message: string;
  data?: TData;
}

export type SuccessResponse<TData = unknown, TCode extends SuccessCode = SuccessCode> = ApiResponse<
  TData,
  TCode
> & {
  success: true;
  data: TData;
};

export type ErrorResponse<TData = null, TCode extends ErrorCode = ErrorCode> = ApiResponse<
  TData,
  TCode
> & {
  success: false;
  data?: TData;
};

export interface HealthData {
  status: string;
  timestamp: DateTimeString;
}

export type HealthResponse = SuccessResponse<HealthData, "HEALTHY">;

export interface LicenseAuthenticateRequest {
  licenseKey: string;
  pluginId: string;
  pluginVersion: string;
  kintoneDomain: string;
  companyName?: string;
  appId?: string;
  environment?: Environment;
}

export interface LicenseAuthenticateData {
  licenseId: string;
  licenseStatus: string;
  contractStatus: string;
  pluginId: string;
  pluginName: string;
  expireDate: DateString;
  registeredDomain: string;
  maxDomains: number;
  currentDomains: number;
}

export type LicenseAuthenticateResponse = SuccessResponse<LicenseAuthenticateData, "LICENSE_ACTIVE">;

export interface LicenseStatusQuery {
  licenseKey: string;
  pluginId: string;
  kintoneDomain: string;
}

export interface LicenseStatusData {
  licenseStatus: string;
  expireDate: DateString;
  daysRemaining: number;
  available: boolean;
}

export type LicenseStatusResponse = SuccessResponse<LicenseStatusData, "LICENSE_ACTIVE">;

export interface LicenseDeactivateRequest {
  licenseKey: string;
  pluginId: string;
  kintoneDomain: string;
  reason?: string;
}

export interface LicenseDeactivateData {
  licenseStatus: string;
  deactivatedAt: DateTimeString;
}

export type LicenseDeactivateResponse = SuccessResponse<
  LicenseDeactivateData,
  "LICENSE_DEACTIVATED"
>;

export interface PluginVersionQuery {
  pluginId: string;
  currentVersion: string;
}

export interface PluginVersionData {
  pluginId: string;
  currentVersion: string;
  latestVersion: string;
  updateRequired: boolean;
  forceUpdate: boolean;
  releaseNote?: string;
  releasedAt?: DateString;
}

export type PluginVersionResponse = SuccessResponse<PluginVersionData, "VERSION_CHECKED">;

export interface PluginListQuery {
  memberId: string;
}

export interface PluginListItem {
  pluginId: string;
  pluginName: string;
  latestVersion: string;
  licenseStatus: string;
  downloadAvailable: boolean;
}

export type PluginListResponse = SuccessResponse<PluginListItem[], "PLUGIN_LIST_FOUND">;

export interface DownloadTokenRequest {
  memberId: string;
  pluginId: string;
  licenseKey: string;
}

export interface DownloadTokenData {
  downloadUrl: string;
  expiresIn: number;
}

export type DownloadTokenResponse = SuccessResponse<DownloadTokenData, "DOWNLOAD_TOKEN_CREATED">;

export interface ContractStatusQuery {
  memberId: string;
}

export interface ContractLicenseItem {
  licenseKey: string;
  pluginId: string;
  pluginName: string;
  status: string;
  expireDate: DateString;
}

export interface ContractStatusData {
  memberId: string;
  contractStatus: string;
  planName: string;
  contractStartDate: DateString;
  contractEndDate: DateString;
  licenses: ContractLicenseItem[];
}

export type ContractStatusResponse = SuccessResponse<ContractStatusData, "CONTRACT_FOUND">;

export interface AuthLogRequest {
  licenseKey?: string;
  pluginId?: string;
  kintoneDomain?: string;
  eventType: AuthLogEventType;
  result: AuthLogResult;
  message?: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface AuthLogData {
  logId: string;
}

export type AuthLogResponse = SuccessResponse<AuthLogData, "LOG_CREATED">;
