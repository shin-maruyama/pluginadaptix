import { describe, expect, it } from "vitest";
import request from "supertest";

import { createApp } from "../app.js";
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
import { createLicenseKeyHash } from "../utils/license-key.js";
import type { Env } from "../config/env.js";

class RouteTestRepository implements LicenseRepository {
  public authLogs: AuthLogInput[] = [];
  public addedDomains: AddRegisteredDomainInput[] = [];
  public updatedDomainStatuses: Array<{ domainId: string; domainStatus: string }> = [];
  public licenseUpdates: Array<{ licenseId: string; input: LicenseAuthUpdateInput }> = [];

  public async findLicenseByLicenseKeyHash(licenseKeyHash: string): Promise<LicenseEntity | undefined> {
    if (licenseKeyHash !== createLicenseKeyHash("LIC-AAAA-BBBB-1234")) {
      return undefined;
    }

    return {
      licenseId: "LIC-000001",
      licenseKeyHash,
      customerId: "CUS-000001",
      contractId: "CON-000001",
      pluginId: "plugin_001",
      licenseStatus: "active",
      expireDate: "2999-12-31",
      maxDomainCount: 2,
      currentDomainCount: 0
    };
  }

  public async findContractById(contractId: string): Promise<ContractEntity | undefined> {
    return {
      contractId,
      contractStatus: "active",
      contractEnd: "2999-12-31"
    };
  }

  public async findPluginById(pluginId: string): Promise<PluginEntity | undefined> {
    return {
      pluginId,
      pluginName: "Sample Plugin"
    };
  }

  public async findRegisteredDomainsByLicenseId(
    licenseId: string
  ): Promise<RegisteredDomainEntity[]> {
    if (licenseId !== "LIC-000001") {
      return [];
    }

    return [
      {
        domainId: "DOM-000001",
        licenseId,
        kintoneDomain: "registered.cybozu.com",
        domainStatus: "active"
      }
    ];
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

function createTestEnv(): Env {
  return {
    port: 3000,
    apiKey: "test-api-key",
    kintoneBaseUrl: "https://example.cybozu.com",
    kintoneApiToken: "token",
    kintoneApps: {
      customers: "100",
      contracts: "101",
      licenses: "102",
      plugins: "103",
      pluginVersions: "104",
      registeredDomains: "105",
      authLogs: "106",
      downloadLogs: "107"
    }
  };
}

describe("POST /v1/licenses/authenticate", () => {
  it("requires API key authentication", async () => {
    const app = createApp({
      env: createTestEnv(),
      licenseRepository: new RouteTestRepository()
    });

    const response = await request(app).post("/v1/licenses/authenticate").send({}).expect(401);

    expect(response.body).toEqual({
      success: false,
      code: "INVALID_API_KEY",
      message: "Invalid API key.",
      data: null
    });
  });

  it("returns validation errors before service execution", async () => {
    const repository = new RouteTestRepository();
    const app = createApp({
      env: createTestEnv(),
      licenseRepository: repository
    });

    const response = await request(app)
      .post("/v1/licenses/authenticate")
      .set("X-API-Key", "test-api-key")
      .send({
        licenseKey: "LIC-AAAA-BBBB-1234"
      })
      .expect(400);

    expect(response.body).toMatchObject({
      success: false,
      code: "INVALID_REQUEST"
    });
    expect(repository.authLogs).toHaveLength(0);
  });

  it("authenticates licenses through the route", async () => {
    const repository = new RouteTestRepository();
    const app = createApp({
      env: createTestEnv(),
      licenseRepository: repository
    });

    const response = await request(app)
      .post("/v1/licenses/authenticate")
      .set("X-API-Key", "test-api-key")
      .send({
        licenseKey: "LIC-AAAA-BBBB-1234",
        pluginId: "plugin_001",
        pluginVersion: "1.0.0",
        kintoneDomain: "new.cybozu.com",
        appId: "123",
        environment: "production"
      })
      .expect(200);

    expect(response.body).toMatchObject({
      success: true,
      code: "LICENSE_ACTIVE",
      message: "License authentication succeeded.",
      data: {
        licenseId: "LIC-000001",
        licenseStatus: "active",
        contractStatus: "active",
        pluginId: "plugin_001",
        pluginName: "Sample Plugin",
        expireDate: "2999-12-31",
        registeredDomain: "new.cybozu.com",
        maxDomains: 2,
        currentDomains: 2
      }
    });
    expect(repository.addedDomains).toHaveLength(1);
    expect(repository.authLogs).toEqual([
      expect.objectContaining({
        resultStatus: "success",
        licenseKey: "LIC-****-****-1234"
      })
    ]);
  });

  it("returns service errors in the common response format", async () => {
    const repository = new RouteTestRepository();
    const app = createApp({
      env: createTestEnv(),
      licenseRepository: repository
    });

    const response = await request(app)
      .post("/v1/licenses/authenticate")
      .set("X-API-Key", "test-api-key")
      .send({
        licenseKey: "LIC-NOT-FOUND-9999",
        pluginId: "plugin_001",
        pluginVersion: "1.0.0",
        kintoneDomain: "sample.cybozu.com"
      })
      .expect(401);

    expect(response.body).toEqual({
      success: false,
      code: "INVALID_LICENSE_KEY",
      message: "Invalid license key.",
      data: null
    });
    expect(repository.authLogs).toEqual([
      expect.objectContaining({
        resultStatus: "failure",
        message: "INVALID_LICENSE_KEY"
      })
    ]);
  });
});

describe("GET /v1/licenses/status", () => {
  it("returns validation errors for missing query parameters", async () => {
    const app = createApp({
      env: createTestEnv(),
      licenseRepository: new RouteTestRepository()
    });

    const response = await request(app)
      .get("/v1/licenses/status")
      .set("X-API-Key", "test-api-key")
      .query({
        licenseKey: "LIC-AAAA-BBBB-1234"
      })
      .expect(400);

    expect(response.body).toMatchObject({
      success: false,
      code: "INVALID_REQUEST"
    });
  });

  it("returns license status through the route", async () => {
    const repository = new RouteTestRepository();
    const app = createApp({
      env: createTestEnv(),
      licenseRepository: repository
    });

    const response = await request(app)
      .get("/v1/licenses/status")
      .set("X-API-Key", "test-api-key")
      .query({
        licenseKey: "LIC-AAAA-BBBB-1234",
        pluginId: "plugin_001",
        kintoneDomain: "registered.cybozu.com"
      })
      .expect(200);

    expect(response.body).toMatchObject({
      success: true,
      code: "LICENSE_ACTIVE",
      message: "License is active.",
      data: {
        licenseStatus: "active",
        expireDate: "2999-12-31",
        available: true
      }
    });
    expect(response.body.data.daysRemaining).toBeGreaterThan(0);
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
        resultStatus: "success"
      })
    ]);
  });

  it("returns domain mismatch failures in the common response format", async () => {
    const repository = new RouteTestRepository();
    const app = createApp({
      env: createTestEnv(),
      licenseRepository: repository
    });

    const response = await request(app)
      .get("/v1/licenses/status")
      .set("X-API-Key", "test-api-key")
      .query({
        licenseKey: "LIC-AAAA-BBBB-1234",
        pluginId: "plugin_001",
        kintoneDomain: "missing.cybozu.com"
      })
      .expect(403);

    expect(response.body).toEqual({
      success: false,
      code: "DOMAIN_MISMATCH",
      message: "Domain does not match.",
      data: null
    });
    expect(repository.authLogs).toEqual([
      expect.objectContaining({
        eventType: "status",
        resultStatus: "failure",
        message: "DOMAIN_MISMATCH"
      })
    ]);
  });
});

describe("POST /v1/licenses/deactivate", () => {
  it("returns validation errors for missing body fields", async () => {
    const app = createApp({
      env: createTestEnv(),
      licenseRepository: new RouteTestRepository()
    });

    const response = await request(app)
      .post("/v1/licenses/deactivate")
      .set("X-API-Key", "test-api-key")
      .send({
        licenseKey: "LIC-AAAA-BBBB-1234"
      })
      .expect(400);

    expect(response.body).toMatchObject({
      success: false,
      code: "INVALID_REQUEST"
    });
  });

  it("deactivates registered domains through the route", async () => {
    const repository = new RouteTestRepository();
    const app = createApp({
      env: createTestEnv(),
      licenseRepository: repository
    });

    const response = await request(app)
      .post("/v1/licenses/deactivate")
      .set("X-API-Key", "test-api-key")
      .send({
        licenseKey: "LIC-AAAA-BBBB-1234",
        pluginId: "plugin_001",
        kintoneDomain: "registered.cybozu.com",
        reason: "user_deactivated"
      })
      .expect(200);

    expect(response.body).toMatchObject({
      success: true,
      code: "LICENSE_DEACTIVATED",
      message: "License domain deactivated.",
      data: {
        licenseStatus: "inactive"
      }
    });
    expect(typeof response.body.data.deactivatedAt).toBe("string");
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
          currentDomainCount: 0,
          lastAuthResult: "deactivated"
        }
      }
    ]);
    expect(repository.authLogs).toEqual([
      expect.objectContaining({
        eventType: "deactivate",
        resultStatus: "success"
      })
    ]);
  });

  it("returns domain mismatch failures in the common response format", async () => {
    const repository = new RouteTestRepository();
    const app = createApp({
      env: createTestEnv(),
      licenseRepository: repository
    });

    const response = await request(app)
      .post("/v1/licenses/deactivate")
      .set("X-API-Key", "test-api-key")
      .send({
        licenseKey: "LIC-AAAA-BBBB-1234",
        pluginId: "plugin_001",
        kintoneDomain: "missing.cybozu.com"
      })
      .expect(403);

    expect(response.body).toEqual({
      success: false,
      code: "DOMAIN_MISMATCH",
      message: "Domain does not match.",
      data: null
    });
    expect(repository.authLogs).toEqual([
      expect.objectContaining({
        eventType: "deactivate",
        resultStatus: "failure",
        message: "DOMAIN_MISMATCH"
      })
    ]);
  });
});
