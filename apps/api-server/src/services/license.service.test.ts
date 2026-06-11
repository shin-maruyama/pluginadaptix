import { describe, expect, it } from "vitest";

import type {
  AddRegisteredDomainInput,
  AuthLogInput,
  ContractEntity,
  LicenseAuthUpdateInput,
  LicenseEntity,
  LicenseRepository,
  PluginEntity,
  RegisteredDomainEntity
} from "../repositories/license.repository.js";
import { LicenseService } from "./license.service.js";
import { createLicenseKeyHash } from "../utils/license-key.js";

class FakeLicenseRepository implements LicenseRepository {
  public license?: LicenseEntity;
  public contract: ContractEntity | undefined;
  public plugin?: PluginEntity;
  public domains: RegisteredDomainEntity[] = [];
  public addedDomains: AddRegisteredDomainInput[] = [];
  public updatedDomainStatuses: Array<{ domainId: string; domainStatus: string }> = [];
  public authLogs: AuthLogInput[] = [];
  public licenseUpdates: Array<{ licenseId: string; input: LicenseAuthUpdateInput }> = [];

  public async findLicenseByLicenseKeyHash(licenseKeyHash: string): Promise<LicenseEntity | undefined> {
    return this.license?.licenseKeyHash === licenseKeyHash ? this.license : undefined;
  }

  public async findContractById(contractId: string): Promise<ContractEntity | undefined> {
    return this.contract?.contractId === contractId ? this.contract : undefined;
  }

  public async findPluginById(pluginId: string): Promise<PluginEntity | undefined> {
    return this.plugin?.pluginId === pluginId ? this.plugin : undefined;
  }

  public async findRegisteredDomainsByLicenseId(
    licenseId: string
  ): Promise<RegisteredDomainEntity[]> {
    return this.domains.filter((domain) => domain.licenseId === licenseId);
  }

  public async addRegisteredDomain(input: AddRegisteredDomainInput): Promise<void> {
    this.addedDomains.push(input);
  }

  public async updateRegisteredDomainStatus(domainId: string, domainStatus: string): Promise<void> {
    this.updatedDomainStatuses.push({ domainId, domainStatus });
  }

  public async updateLicenseAuthResult(
    licenseId: string,
    input: LicenseAuthUpdateInput
  ): Promise<void> {
    this.licenseUpdates.push({ licenseId, input });
  }

  public async addAuthLog(input: AuthLogInput): Promise<void> {
    this.authLogs.push(input);
  }
}

function createRepository(): FakeLicenseRepository {
  const repository = new FakeLicenseRepository();
  repository.license = {
    licenseId: "LIC-000001",
    licenseKeyHash: createLicenseKeyHash("LIC-AAAA-BBBB-1234"),
    customerId: "CUS-000001",
    contractId: "CON-000001",
    pluginId: "plugin_001",
    licenseStatus: "active",
    expireDate: "2999-12-31",
    maxDomainCount: 2,
    currentDomainCount: 0
  };
  repository.contract = {
    contractId: "CON-000001",
    contractStatus: "active",
    contractEnd: "2999-12-31"
  };
  repository.plugin = {
    pluginId: "plugin_001",
    pluginName: "Sample Plugin"
  };
  return repository;
}

const validRequest = {
  licenseKey: "LIC-AAAA-BBBB-1234",
  pluginId: "plugin_001",
  pluginVersion: "1.0.0",
  kintoneDomain: "sample.cybozu.com",
  appId: "123",
  environment: "production" as const
};

describe("LicenseService.authenticate", () => {
  it("authenticates an active license and registers a new domain", async () => {
    const repository = createRepository();
    const service = new LicenseService(repository);

    await expect(service.authenticate(validRequest)).resolves.toMatchObject({
      success: true,
      code: "LICENSE_ACTIVE",
      data: {
        licenseId: "LIC-000001",
        pluginId: "plugin_001",
        pluginName: "Sample Plugin",
        registeredDomain: "sample.cybozu.com",
        maxDomains: 2,
        currentDomains: 1
      }
    });

    expect(repository.addedDomains).toHaveLength(1);
    expect(repository.licenseUpdates).toEqual([
      {
        licenseId: "LIC-000001",
        input: {
          currentDomainCount: 1,
          lastAuthResult: "success"
        }
      }
    ]);
    expect(repository.authLogs).toEqual([
      expect.objectContaining({
        resultStatus: "success",
        licenseKey: "LIC-****-****-1234"
      })
    ]);
  });

  it("logs and rejects invalid license keys", async () => {
    const repository = createRepository();
    const service = new LicenseService(repository);

    await expect(
      service.authenticate({ ...validRequest, licenseKey: "LIC-NOT-FOUND-9999" })
    ).rejects.toMatchObject({
      status: 401,
      response: {
        code: "INVALID_LICENSE_KEY"
      }
    });
    expect(repository.authLogs).toEqual([
      expect.objectContaining({
        resultStatus: "failure",
        message: "INVALID_LICENSE_KEY",
        licenseKey: "LIC-****-****-9999"
      })
    ]);
  });

  it("rejects expired licenses", async () => {
    const repository = createRepository();
    repository.license = {
      ...repository.license,
      licenseId: "LIC-000001",
      licenseKeyHash: createLicenseKeyHash("LIC-AAAA-BBBB-1234"),
      customerId: "CUS-000001",
      contractId: "CON-000001",
      pluginId: "plugin_001",
      licenseStatus: "active",
      expireDate: "2000-01-01",
      maxDomainCount: 2,
      currentDomainCount: 0
    };
    const service = new LicenseService(repository);

    await expect(service.authenticate(validRequest)).rejects.toMatchObject({
      status: 403,
      response: {
        code: "LICENSE_EXPIRED"
      }
    });
  });

  it("rejects missing contracts", async () => {
    const repository = createRepository();
    repository.contract = undefined;
    const service = new LicenseService(repository);

    await expect(service.authenticate(validRequest)).rejects.toMatchObject({
      status: 404,
      response: {
        code: "CONTRACT_NOT_FOUND"
      }
    });
  });

  it("rejects plugin mismatches", async () => {
    const repository = createRepository();
    const service = new LicenseService(repository);

    await expect(service.authenticate({ ...validRequest, pluginId: "plugin_other" })).rejects.toMatchObject({
      status: 403,
      response: {
        code: "PLUGIN_NOT_ALLOWED"
      }
    });
  });

  it("rejects domain limit excess", async () => {
    const repository = createRepository();
    repository.license = {
      ...repository.license,
      licenseId: "LIC-000001",
      licenseKeyHash: createLicenseKeyHash("LIC-AAAA-BBBB-1234"),
      customerId: "CUS-000001",
      contractId: "CON-000001",
      pluginId: "plugin_001",
      licenseStatus: "active",
      expireDate: "2999-12-31",
      maxDomainCount: 1,
      currentDomainCount: 1
    };
    repository.domains = [
      {
        domainId: "DOM-000001",
        licenseId: "LIC-000001",
        kintoneDomain: "already.cybozu.com",
        domainStatus: "active"
      }
    ];
    const service = new LicenseService(repository);

    await expect(service.authenticate(validRequest)).rejects.toMatchObject({
      status: 403,
      response: {
        code: "DOMAIN_LIMIT_EXCEEDED"
      }
    });
  });
});

describe("LicenseService.getStatus", () => {
  it("returns license status, updates last auth, and writes a status log", async () => {
    const repository = createRepository();
    repository.domains = [
      {
        domainId: "DOM-000001",
        licenseId: "LIC-000001",
        kintoneDomain: "sample.cybozu.com",
        domainStatus: "active"
      }
    ];
    const service = new LicenseService(repository);

    const result = await service.getStatus({
      licenseKey: "LIC-AAAA-BBBB-1234",
      pluginId: "plugin_001",
      kintoneDomain: "sample.cybozu.com"
    });

    expect(result).toMatchObject({
      success: true,
      code: "LICENSE_ACTIVE",
      data: {
        licenseStatus: "active",
        expireDate: "2999-12-31",
        available: true
      }
    });
    expect(result.data.daysRemaining).toBeGreaterThan(0);
    expect(repository.licenseUpdates).toEqual([
      {
        licenseId: "LIC-000001",
        input: {
          lastAuthResult: "success"
        }
      }
    ]);
    expect(repository.authLogs).toEqual([
      expect.objectContaining({
        eventType: "status",
        resultStatus: "success",
        licenseKey: "LIC-****-****-1234"
      })
    ]);
  });

  it("rejects unregistered domains and logs the failure", async () => {
    const repository = createRepository();
    repository.domains = [
      {
        domainId: "DOM-000001",
        licenseId: "LIC-000001",
        kintoneDomain: "registered.cybozu.com",
        domainStatus: "active"
      }
    ];
    const service = new LicenseService(repository);

    await expect(
      service.getStatus({
        licenseKey: "LIC-AAAA-BBBB-1234",
        pluginId: "plugin_001",
        kintoneDomain: "sample.cybozu.com"
      })
    ).rejects.toMatchObject({
      status: 403,
      response: {
        code: "DOMAIN_MISMATCH"
      }
    });
    expect(repository.authLogs).toEqual([
      expect.objectContaining({
        eventType: "status",
        resultStatus: "failure",
        message: "DOMAIN_MISMATCH"
      })
    ]);
  });

  it("rejects expired contracts", async () => {
    const repository = createRepository();
    repository.contract = {
      contractId: "CON-000001",
      contractStatus: "active",
      contractEnd: "2000-01-01"
    };
    repository.domains = [
      {
        domainId: "DOM-000001",
        licenseId: "LIC-000001",
        kintoneDomain: "sample.cybozu.com",
        domainStatus: "active"
      }
    ];
    const service = new LicenseService(repository);

    await expect(
      service.getStatus({
        licenseKey: "LIC-AAAA-BBBB-1234",
        pluginId: "plugin_001",
        kintoneDomain: "sample.cybozu.com"
      })
    ).rejects.toMatchObject({
      status: 403,
      response: {
        code: "CONTRACT_EXPIRED"
      }
    });
  });

  it("rejects plugin mismatches", async () => {
    const repository = createRepository();
    const service = new LicenseService(repository);

    await expect(
      service.getStatus({
        licenseKey: "LIC-AAAA-BBBB-1234",
        pluginId: "plugin_other",
        kintoneDomain: "sample.cybozu.com"
      })
    ).rejects.toMatchObject({
      status: 403,
      response: {
        code: "PLUGIN_MISMATCH"
      }
    });
  });
});

describe("LicenseService.deactivate", () => {
  it("deactivates a registered domain, decrements current domain count, and writes a log", async () => {
    const repository = createRepository();
    repository.domains = [
      {
        domainId: "DOM-000001",
        licenseId: "LIC-000001",
        kintoneDomain: "sample.cybozu.com",
        domainStatus: "active"
      },
      {
        domainId: "DOM-000002",
        licenseId: "LIC-000001",
        kintoneDomain: "other.cybozu.com",
        domainStatus: "active"
      }
    ];
    const service = new LicenseService(repository);

    const result = await service.deactivate({
      licenseKey: "LIC-AAAA-BBBB-1234",
      pluginId: "plugin_001",
      kintoneDomain: "sample.cybozu.com",
      reason: "user_deactivated"
    });

    expect(result).toMatchObject({
      success: true,
      code: "LICENSE_DEACTIVATED",
      message: "License domain deactivated.",
      data: {
        licenseStatus: "inactive"
      }
    });
    expect(typeof result.data.deactivatedAt).toBe("string");
    expect(repository.updatedDomainStatuses).toEqual([
      {
        domainId: "DOM-000001",
        domainStatus: "deactivated"
      }
    ]);
    expect(repository.licenseUpdates).toEqual([
      {
        licenseId: "LIC-000001",
        input: {
          currentDomainCount: 1,
          lastAuthResult: "deactivated"
        }
      }
    ]);
    expect(repository.authLogs).toEqual([
      expect.objectContaining({
        eventType: "deactivate",
        resultStatus: "success",
        licenseKey: "LIC-****-****-1234"
      })
    ]);
  });

  it("rejects missing registered domains and logs the failure", async () => {
    const repository = createRepository();
    repository.domains = [
      {
        domainId: "DOM-000001",
        licenseId: "LIC-000001",
        kintoneDomain: "registered.cybozu.com",
        domainStatus: "active"
      }
    ];
    const service = new LicenseService(repository);

    await expect(
      service.deactivate({
        licenseKey: "LIC-AAAA-BBBB-1234",
        pluginId: "plugin_001",
        kintoneDomain: "sample.cybozu.com"
      })
    ).rejects.toMatchObject({
      status: 403,
      response: {
        code: "DOMAIN_MISMATCH"
      }
    });
    expect(repository.updatedDomainStatuses).toHaveLength(0);
    expect(repository.authLogs).toEqual([
      expect.objectContaining({
        eventType: "deactivate",
        resultStatus: "failure",
        message: "DOMAIN_MISMATCH"
      })
    ]);
  });

  it("rejects plugin mismatches", async () => {
    const repository = createRepository();
    const service = new LicenseService(repository);

    await expect(
      service.deactivate({
        licenseKey: "LIC-AAAA-BBBB-1234",
        pluginId: "plugin_other",
        kintoneDomain: "sample.cybozu.com"
      })
    ).rejects.toMatchObject({
      status: 403,
      response: {
        code: "PLUGIN_MISMATCH"
      }
    });
  });
});
