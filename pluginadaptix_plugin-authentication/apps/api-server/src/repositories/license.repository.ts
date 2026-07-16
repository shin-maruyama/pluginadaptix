import type {
  AddRecordResponse,
  GetRecordsResponse,
  KintoneClient,
  KintoneRecord,
  KintoneRecordInput
} from "@pluginadaptix/kintone-client";
import type { Environment } from "@pluginadaptix/shared";

import type { KintoneAppEnv } from "../config/env.js";

export interface LicenseEntity {
  licenseId: string;
  licenseKeyHash: string;
  customerId: string;
  contractId: string;
  pluginId: string;
  licenseStatus: string;
  expireDate: string;
  maxDomainCount: number;
  currentDomainCount: number;
}

export interface ContractEntity {
  contractId: string;
  contractStatus: string;
  contractEnd: string;
}

export interface PluginEntity {
  pluginId: string;
  pluginName: string;
}

export interface RegisteredDomainEntity {
  domainId: string;
  licenseId: string;
  kintoneDomain: string;
  domainStatus: string;
}

export interface AddRegisteredDomainInput {
  licenseId: string;
  licenseKey: string;
  kintoneDomain: string;
  appId?: string;
  environment?: Environment;
}

export interface LicenseAuthUpdateInput {
  currentDomainCount?: number;
  lastAuthResult: string;
}

export interface AuthLogInput {
  eventType: "authenticate" | "status" | "deactivate" | "download" | "error";
  resultStatus: "success" | "failure" | "warning";
  licenseKey?: string;
  pluginId?: string;
  pluginVersion?: string;
  kintoneDomain?: string;
  appId?: string;
  ipAddress?: string;
  userAgent?: string;
  message?: string;
}

export interface LicenseRepository {
  findLicenseByLicenseKeyHash(licenseKeyHash: string): Promise<LicenseEntity | undefined>;
  findContractById(contractId: string): Promise<ContractEntity | undefined>;
  findPluginById(pluginId: string): Promise<PluginEntity | undefined>;
  findRegisteredDomainsByLicenseId(licenseId: string): Promise<RegisteredDomainEntity[]>;
  addRegisteredDomain(input: AddRegisteredDomainInput): Promise<void>;
  updateRegisteredDomainStatus(domainId: string, domainStatus: string): Promise<void>;
  updateLicenseAuthResult(licenseId: string, input: LicenseAuthUpdateInput): Promise<void>;
  addAuthLog(input: AuthLogInput): Promise<void>;
}

export class KintoneLicenseRepository implements LicenseRepository {
  public constructor(
    private readonly client: KintoneClient,
    private readonly apps: KintoneAppEnv
  ) {}

  public async findLicenseByLicenseKeyHash(
    licenseKeyHash: string
  ): Promise<LicenseEntity | undefined> {
    const response = await this.client.getRecords({
      app: requireAppId(this.apps.licenses, "KINTONE_APP_LICENSES"),
      query: `license_key_hash = "${escapeQueryValue(licenseKeyHash)}" limit 1`
    });
    const record = response.records[0];

    return record === undefined ? undefined : toLicenseEntity(record);
  }

  public async findContractById(contractId: string): Promise<ContractEntity | undefined> {
    const response = await this.client.getRecords({
      app: requireAppId(this.apps.contracts, "KINTONE_APP_CONTRACTS"),
      query: `contract_id = "${escapeQueryValue(contractId)}" limit 1`
    });
    const record = response.records[0];

    return record === undefined ? undefined : toContractEntity(record);
  }

  public async findPluginById(pluginId: string): Promise<PluginEntity | undefined> {
    const response = await this.client.getRecords({
      app: requireAppId(this.apps.plugins, "KINTONE_APP_PLUGINS"),
      query: `plugin_id = "${escapeQueryValue(pluginId)}" limit 1`
    });
    const record = response.records[0];

    return record === undefined ? undefined : toPluginEntity(record);
  }

  public async findRegisteredDomainsByLicenseId(
    licenseId: string
  ): Promise<RegisteredDomainEntity[]> {
    const response: GetRecordsResponse = await this.client.getRecords({
      app: requireAppId(this.apps.registeredDomains, "KINTONE_APP_REGISTERED_DOMAINS"),
      query: `license_id = "${escapeQueryValue(licenseId)}"`
    });

    return response.records.map(toRegisteredDomainEntity);
  }

  public async addRegisteredDomain(input: AddRegisteredDomainInput): Promise<void> {
    await this.client.addRecord({
      app: requireAppId(this.apps.registeredDomains, "KINTONE_APP_REGISTERED_DOMAINS"),
      record: createRecordInput({
        domain_id: createId("DOM"),
        license_id: input.licenseId,
        license_key: input.licenseKey,
        kintone_domain: input.kintoneDomain,
        domain_status: "active",
        registered_at: new Date().toISOString(),
        ...(input.appId !== undefined ? { app_id: input.appId } : {}),
        ...(input.environment !== undefined ? { environment: input.environment } : {})
      })
    });
  }

  public async updateRegisteredDomainStatus(
    domainId: string,
    domainStatus: string
  ): Promise<void> {
    await this.client.updateRecord({
      app: requireAppId(this.apps.registeredDomains, "KINTONE_APP_REGISTERED_DOMAINS"),
      updateKey: {
        field: "domain_id",
        value: domainId
      },
      record: createRecordInput({
        domain_status: domainStatus,
        deactivated_at: new Date().toISOString()
      })
    });
  }

  public async updateLicenseAuthResult(
    licenseId: string,
    input: LicenseAuthUpdateInput
  ): Promise<void> {
    await this.client.updateRecord({
      app: requireAppId(this.apps.licenses, "KINTONE_APP_LICENSES"),
      updateKey: {
        field: "license_id",
        value: licenseId
      },
      record: createRecordInput({
        ...(input.currentDomainCount !== undefined
          ? { current_domain_count: input.currentDomainCount }
          : {}),
        last_auth_datetime: new Date().toISOString(),
        last_auth_result: input.lastAuthResult
      })
    });
  }

  public async addAuthLog(input: AuthLogInput): Promise<void> {
    const response: AddRecordResponse = await this.client.addRecord({
      app: requireAppId(this.apps.authLogs, "KINTONE_APP_AUTH_LOGS"),
      record: createRecordInput({
        log_id: createId("LOG"),
        auth_datetime: new Date().toISOString(),
        event_type: input.eventType,
        result_status: input.resultStatus,
        ...(input.licenseKey !== undefined ? { license_key: input.licenseKey } : {}),
        ...(input.pluginId !== undefined ? { plugin_id: input.pluginId } : {}),
        ...(input.pluginVersion !== undefined ? { plugin_version: input.pluginVersion } : {}),
        ...(input.kintoneDomain !== undefined ? { kintone_domain: input.kintoneDomain } : {}),
        ...(input.appId !== undefined ? { app_id: input.appId } : {}),
        ...(input.ipAddress !== undefined ? { ip_address: input.ipAddress } : {}),
        ...(input.userAgent !== undefined ? { user_agent: input.userAgent } : {}),
        ...(input.message !== undefined ? { message: input.message } : {})
      })
    });
    void response;
  }
}

function toLicenseEntity(record: KintoneRecord): LicenseEntity {
  return {
    licenseId: readString(record, "license_id"),
    licenseKeyHash: readString(record, "license_key_hash"),
    customerId: readString(record, "customer_id"),
    contractId: readString(record, "contract_id"),
    pluginId: readString(record, "plugin_id"),
    licenseStatus: readString(record, "license_status"),
    expireDate: readString(record, "expire_date"),
    maxDomainCount: readNumber(record, "max_domain_count"),
    currentDomainCount: readNumber(record, "current_domain_count")
  };
}

function toContractEntity(record: KintoneRecord): ContractEntity {
  return {
    contractId: readString(record, "contract_id"),
    contractStatus: readString(record, "contract_status"),
    contractEnd: readString(record, "contract_end")
  };
}

function toPluginEntity(record: KintoneRecord): PluginEntity {
  return {
    pluginId: readString(record, "plugin_id"),
    pluginName: readString(record, "plugin_name")
  };
}

function toRegisteredDomainEntity(record: KintoneRecord): RegisteredDomainEntity {
  return {
    domainId: readString(record, "domain_id"),
    licenseId: readString(record, "license_id"),
    kintoneDomain: readString(record, "kintone_domain"),
    domainStatus: readString(record, "domain_status")
  };
}

function readString(record: KintoneRecord, field: string): string {
  const value = record[field]?.value;

  if (typeof value !== "string") {
    return "";
  }

  return value;
}

function readNumber(record: KintoneRecord, field: string): number {
  const value = record[field]?.value;

  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    const parsedValue = Number(value);
    return Number.isFinite(parsedValue) ? parsedValue : 0;
  }

  return 0;
}

function createRecordInput(values: Record<string, string | number>): KintoneRecordInput {
  return Object.fromEntries(Object.entries(values).map(([key, value]) => [key, { value }]));
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

function createId(prefix: string): string {
  return `${prefix}-${Date.now()}`;
}
