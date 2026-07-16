import type { GetRecordsResponse, KintoneClient, KintoneRecord } from "@pluginadaptix/kintone-client";

import type { KintoneAppEnv } from "../config/env.js";

export interface PluginEntity {
  pluginId: string;
  pluginName: string;
  publishStatus: string;
  latestVersion: string;
  forceUpdateVersion?: string;
}

export interface PluginVersionEntity {
  versionId: string;
  pluginId: string;
  version: string;
  releaseStatus: string;
  releaseDate?: string;
  releaseNote?: string;
  isLatest: string;
  isForceUpdate?: string;
}

export interface CustomerEntity {
  customerId: string;
  wordpressUserId: string;
}

export interface ContractEntity {
  contractId: string;
  customerId: string;
  contractStatus: string;
  contractEnd: string;
}

export interface LicenseEntity {
  licenseId: string;
  customerId: string;
  contractId: string;
  pluginId: string;
  licenseStatus: string;
  expireDate: string;
}

export interface PluginRepository {
  findPluginById(pluginId: string): Promise<PluginEntity | undefined>;
  findLatestPluginVersion(pluginId: string): Promise<PluginVersionEntity | undefined>;
  findLicenseByKeyHashAndPluginId(
    licenseKeyHash: string,
    pluginId: string
  ): Promise<LicenseEntity | undefined>;
  findCustomerByMemberId(memberId: string): Promise<CustomerEntity | undefined>;
  findContractsByCustomerId(customerId: string): Promise<ContractEntity[]>;
  findLicensesByCustomerId(customerId: string): Promise<LicenseEntity[]>;
  addDownloadLog(input: AddDownloadLogInput): Promise<void>;
}

export interface AddDownloadLogInput {
  downloadLogId: string;
  downloadDatetime: string;
  customerId: string;
  pluginId: string;
  versionId: string;
  version: string;
  downloadToken: string;
  tokenExpireAt: string;
  downloadResult: "success" | "failure";
  ipAddress?: string;
  userAgent?: string;
  message?: string;
}

export class KintonePluginRepository implements PluginRepository {
  public constructor(
    private readonly client: KintoneClient,
    private readonly apps: KintoneAppEnv
  ) {}

  public async findPluginById(pluginId: string): Promise<PluginEntity | undefined> {
    const response = await this.client.getRecords({
      app: requireAppId(this.apps.plugins, "KINTONE_APP_PLUGINS"),
      query: `plugin_id = "${escapeQueryValue(pluginId)}" limit 1`
    });
    const record = response.records[0];

    return record === undefined ? undefined : toPluginEntity(record);
  }

  public async findLatestPluginVersion(pluginId: string): Promise<PluginVersionEntity | undefined> {
    const response: GetRecordsResponse = await this.client.getRecords({
      app: requireAppId(this.apps.pluginVersions, "KINTONE_APP_PLUGIN_VERSIONS"),
      query: `plugin_id = "${escapeQueryValue(pluginId)}" and is_latest in ("はい", "true", "TRUE", "1") and release_status in ("公開", "published", "PUBLISHED", "public", "PUBLIC") limit 1`
    });
    const record = response.records[0];

    return record === undefined ? undefined : toPluginVersionEntity(record);
  }

  public async findCustomerByMemberId(memberId: string): Promise<CustomerEntity | undefined> {
    const response = await this.client.getRecords({
      app: requireAppId(this.apps.customers, "KINTONE_APP_CUSTOMERS"),
      query: `wordpress_user_id = "${escapeQueryValue(memberId)}" limit 1`
    });
    const record = response.records[0];

    return record === undefined ? undefined : toCustomerEntity(record);
  }

  public async findLicenseByKeyHashAndPluginId(
    licenseKeyHash: string,
    pluginId: string
  ): Promise<LicenseEntity | undefined> {
    const response = await this.client.getRecords({
      app: requireAppId(this.apps.licenses, "KINTONE_APP_LICENSES"),
      query: `license_key_hash = "${escapeQueryValue(licenseKeyHash)}" and plugin_id = "${escapeQueryValue(pluginId)}" limit 1`
    });
    const record = response.records[0];

    return record === undefined ? undefined : toLicenseEntity(record);
  }

  public async findContractsByCustomerId(customerId: string): Promise<ContractEntity[]> {
    const response: GetRecordsResponse = await this.client.getRecords({
      app: requireAppId(this.apps.contracts, "KINTONE_APP_CONTRACTS"),
      query: `customer_id = "${escapeQueryValue(customerId)}"`
    });

    return response.records.map(toContractEntity);
  }

  public async findLicensesByCustomerId(customerId: string): Promise<LicenseEntity[]> {
    const response: GetRecordsResponse = await this.client.getRecords({
      app: requireAppId(this.apps.licenses, "KINTONE_APP_LICENSES"),
      query: `customer_id = "${escapeQueryValue(customerId)}"`
    });

    return response.records.map(toLicenseEntity);
  }

  public async addDownloadLog(input: AddDownloadLogInput): Promise<void> {
    await this.client.addRecord({
      app: requireAppId(this.apps.downloadLogs, "KINTONE_APP_DOWNLOAD_LOGS"),
      record: {
        download_log_id: { value: input.downloadLogId },
        download_datetime: { value: input.downloadDatetime },
        customer_id: { value: input.customerId },
        plugin_id: { value: input.pluginId },
        version_id: { value: input.versionId },
        version: { value: input.version },
        download_token: { value: input.downloadToken },
        token_expire_at: { value: input.tokenExpireAt },
        download_result: { value: input.downloadResult },
        ...(input.ipAddress !== undefined ? { ip_address: { value: input.ipAddress } } : {}),
        ...(input.userAgent !== undefined ? { user_agent: { value: input.userAgent } } : {}),
        ...(input.message !== undefined ? { message: { value: input.message } } : {})
      }
    });
  }
}

function toPluginEntity(record: KintoneRecord): PluginEntity {
  const forceUpdateVersion = readOptionalString(record, "force_update_version");

  return {
    pluginId: readString(record, "plugin_id"),
    pluginName: readString(record, "plugin_name"),
    publishStatus: readString(record, "publish_status"),
    latestVersion: readString(record, "latest_version"),
    ...(forceUpdateVersion !== undefined ? { forceUpdateVersion } : {})
  };
}

function toPluginVersionEntity(record: KintoneRecord): PluginVersionEntity {
  const releaseDate = readOptionalString(record, "release_date");
  const releaseNote = readOptionalString(record, "release_note");
  const isForceUpdate = readOptionalString(record, "is_force_update");

  return {
    versionId: readString(record, "version_id"),
    pluginId: readString(record, "plugin_id"),
    version: readString(record, "version"),
    releaseStatus: readString(record, "release_status"),
    isLatest: readString(record, "is_latest"),
    ...(releaseDate !== undefined ? { releaseDate } : {}),
    ...(releaseNote !== undefined ? { releaseNote } : {}),
    ...(isForceUpdate !== undefined ? { isForceUpdate } : {})
  };
}

function toCustomerEntity(record: KintoneRecord): CustomerEntity {
  return {
    customerId: readString(record, "customer_id"),
    wordpressUserId: readString(record, "wordpress_user_id")
  };
}

function toContractEntity(record: KintoneRecord): ContractEntity {
  return {
    contractId: readString(record, "contract_id"),
    customerId: readString(record, "customer_id"),
    contractStatus: readString(record, "contract_status"),
    contractEnd: readString(record, "contract_end")
  };
}

function toLicenseEntity(record: KintoneRecord): LicenseEntity {
  return {
    licenseId: readString(record, "license_id"),
    customerId: readString(record, "customer_id"),
    contractId: readString(record, "contract_id"),
    pluginId: readString(record, "plugin_id"),
    licenseStatus: readString(record, "license_status"),
    expireDate: readString(record, "expire_date")
  };
}

function readString(record: KintoneRecord, field: string): string {
  return readOptionalString(record, field) ?? "";
}

function readOptionalString(record: KintoneRecord, field: string): string | undefined {
  const value = record[field]?.value;

  if (typeof value !== "string" || value.length === 0) {
    return undefined;
  }

  return value;
}

function requireAppId(value: string, name: string): string {
  if (value.trim().length === 0) {
    throw new Error(`${name} is required.`);
  }

  return value;
}

function escapeQueryValue(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
