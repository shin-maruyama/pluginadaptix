import { describe, expect, it } from "vitest";
import request from "supertest";

import { createApp } from "../app.js";
import type { Env } from "../config/env.js";
import type {
  AddDownloadLogInput,
  ContractEntity,
  CustomerEntity,
  LicenseEntity,
  PluginEntity,
  PluginRepository,
  PluginVersionEntity
} from "../repositories/plugin.repository.js";
import { createLicenseKeyHash } from "../utils/license-key.js";

class RouteTestPluginRepository implements PluginRepository {
  public plugin: PluginEntity | undefined = {
    pluginId: "plugin_001",
    pluginName: "Sample Plugin",
    publishStatus: "public",
    latestVersion: "1.2.0"
  };
  public latestVersion: PluginVersionEntity | undefined = {
    versionId: "VER-000001",
    pluginId: "plugin_001",
    version: "1.2.0",
    releaseStatus: "published",
    releaseDate: "2026-01-10",
    releaseNote: "Bug fixes",
    isLatest: "true",
    isForceUpdate: "true"
  };
  public customer: CustomerEntity | undefined = {
    customerId: "CUS-000001",
    wordpressUserId: "mem_001"
  };
  public contracts: ContractEntity[] = [
    {
      contractId: "CON-000001",
      customerId: "CUS-000001",
      contractStatus: "active",
      contractEnd: "2999-12-31"
    }
  ];
  public licenses: LicenseEntity[] = [
    {
      licenseId: "LIC-000001",
      customerId: "CUS-000001",
      contractId: "CON-000001",
      pluginId: "plugin_001",
      licenseStatus: "active",
      expireDate: "2999-12-31"
    }
  ];
  public downloadLogs: AddDownloadLogInput[] = [];

  public async findPluginById(pluginId: string): Promise<PluginEntity | undefined> {
    return this.plugin?.pluginId === pluginId ? this.plugin : undefined;
  }

  public async findLatestPluginVersion(pluginId: string): Promise<PluginVersionEntity | undefined> {
    return this.latestVersion?.pluginId === pluginId ? this.latestVersion : undefined;
  }

  public async findCustomerByMemberId(memberId: string): Promise<CustomerEntity | undefined> {
    return this.customer?.wordpressUserId === memberId ? this.customer : undefined;
  }

  public async findLicenseByKeyHashAndPluginId(
    licenseKeyHash: string,
    pluginId: string
  ): Promise<LicenseEntity | undefined> {
    const expectedHash = createLicenseKeyHash("LIC-TEST-0001");

    if (licenseKeyHash !== expectedHash) {
      return undefined;
    }

    return this.licenses.find((license) => license.pluginId === pluginId);
  }

  public async findContractsByCustomerId(customerId: string): Promise<ContractEntity[]> {
    return this.contracts.filter((contract) => contract.customerId === customerId);
  }

  public async findLicensesByCustomerId(customerId: string): Promise<LicenseEntity[]> {
    return this.licenses.filter((license) => license.customerId === customerId);
  }

  public async addDownloadLog(input: AddDownloadLogInput): Promise<void> {
    this.downloadLogs.push(input);
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

describe("GET /v1/plugins/version", () => {
  it("requires API key authentication", async () => {
    const app = createApp({
      env: createTestEnv(),
      pluginRepository: new RouteTestPluginRepository()
    });

    const response = await request(app).get("/v1/plugins/version").expect(401);

    expect(response.body).toEqual({
      success: false,
      code: "INVALID_API_KEY",
      message: "Invalid API key.",
      data: null
    });
  });

  it("returns validation errors", async () => {
    const app = createApp({
      env: createTestEnv(),
      pluginRepository: new RouteTestPluginRepository()
    });

    const response = await request(app)
      .get("/v1/plugins/version")
      .set("X-API-Key", "test-api-key")
      .query({
        pluginId: "plugin_001"
      })
      .expect(400);

    expect(response.body).toMatchObject({
      success: false,
      code: "INVALID_REQUEST"
    });
  });

  it("returns latest plugin version details", async () => {
    const app = createApp({
      env: createTestEnv(),
      pluginRepository: new RouteTestPluginRepository()
    });

    const response = await request(app)
      .get("/v1/plugins/version")
      .set("X-API-Key", "test-api-key")
      .query({
        pluginId: "plugin_001",
        currentVersion: "1.0.0"
      })
      .expect(200);

    expect(response.body).toEqual({
      success: true,
      code: "VERSION_CHECKED",
      message: "Plugin version checked.",
      data: {
        pluginId: "plugin_001",
        currentVersion: "1.0.0",
        latestVersion: "1.2.0",
        updateRequired: true,
        forceUpdate: true,
        releaseNote: "Bug fixes",
        releasedAt: "2026-01-10"
      }
    });
  });

  it("returns common errors for private plugins", async () => {
    const repository = new RouteTestPluginRepository();
    repository.plugin = {
      pluginId: "plugin_001",
      pluginName: "Sample Plugin",
      publishStatus: "private",
      latestVersion: "1.2.0"
    };
    const app = createApp({
      env: createTestEnv(),
      pluginRepository: repository
    });

    const response = await request(app)
      .get("/v1/plugins/version")
      .set("X-API-Key", "test-api-key")
      .query({
        pluginId: "plugin_001",
        currentVersion: "1.0.0"
      })
      .expect(403);

    expect(response.body).toEqual({
      success: false,
      code: "PLUGIN_NOT_ALLOWED",
      message: "Plugin is not available.",
      data: null
    });
  });
});

describe("POST /v1/plugins/download-token", () => {
  it("returns validation errors", async () => {
    const app = createApp({
      env: createTestEnv(),
      pluginRepository: new RouteTestPluginRepository()
    });

    const response = await request(app)
      .post("/v1/plugins/download-token")
      .set("X-API-Key", "test-api-key")
      .send({
        memberId: "mem_001",
        pluginId: "plugin_001"
      })
      .expect(400);

    expect(response.body).toMatchObject({
      success: false,
      code: "INVALID_REQUEST"
    });
  });

  it("creates a download token for an active license", async () => {
    const repository = new RouteTestPluginRepository();
    const app = createApp({
      env: createTestEnv(),
      pluginRepository: repository
    });

    const response = await request(app)
      .post("/v1/plugins/download-token")
      .set("X-API-Key", "test-api-key")
      .send({
        memberId: "mem_001",
        pluginId: "plugin_001",
        licenseKey: "LIC-TEST-0001"
      })
      .expect(200);

    expect(response.body).toMatchObject({
      success: true,
      code: "DOWNLOAD_TOKEN_CREATED",
      message: "Download token created.",
      data: {
        expiresIn: 300
      }
    });
    expect(response.body.data.downloadUrl).toMatch(
      /^http:\/\/localhost:3000\/v1\/plugins\/download\?token=/
    );
    expect(repository.downloadLogs).toHaveLength(1);
    expect(repository.downloadLogs[0]).toMatchObject({
      customerId: "CUS-000001",
      pluginId: "plugin_001",
      versionId: "VER-000001",
      downloadResult: "success"
    });
  });

  it("returns common errors for invalid license keys", async () => {
    const app = createApp({
      env: createTestEnv(),
      pluginRepository: new RouteTestPluginRepository()
    });

    const response = await request(app)
      .post("/v1/plugins/download-token")
      .set("X-API-Key", "test-api-key")
      .send({
        memberId: "mem_001",
        pluginId: "plugin_001",
        licenseKey: "wrong"
      })
      .expect(401);

    expect(response.body).toEqual({
      success: false,
      code: "INVALID_LICENSE_KEY",
      message: "License key is invalid.",
      data: null
    });
  });
});

describe("GET /v1/plugins", () => {
  it("returns validation errors", async () => {
    const app = createApp({
      env: createTestEnv(),
      pluginRepository: new RouteTestPluginRepository()
    });

    const response = await request(app)
      .get("/v1/plugins")
      .set("X-API-Key", "test-api-key")
      .expect(400);

    expect(response.body).toMatchObject({
      success: false,
      code: "INVALID_REQUEST"
    });
  });

  it("returns public plugins for a member", async () => {
    const app = createApp({
      env: createTestEnv(),
      pluginRepository: new RouteTestPluginRepository()
    });

    const response = await request(app)
      .get("/v1/plugins")
      .set("X-API-Key", "test-api-key")
      .query({
        memberId: "mem_001"
      })
      .expect(200);

    expect(response.body).toEqual({
      success: true,
      code: "PLUGIN_LIST_FOUND",
      message: "Plugin list found.",
      data: [
        {
          pluginId: "plugin_001",
          pluginName: "Sample Plugin",
          latestVersion: "1.2.0",
          licenseStatus: "active",
          downloadAvailable: true
        }
      ]
    });
  });

  it("filters private plugins from list response", async () => {
    const repository = new RouteTestPluginRepository();
    repository.plugin = {
      pluginId: "plugin_001",
      pluginName: "Sample Plugin",
      publishStatus: "private",
      latestVersion: "1.2.0"
    };
    const app = createApp({
      env: createTestEnv(),
      pluginRepository: repository
    });

    const response = await request(app)
      .get("/v1/plugins")
      .set("X-API-Key", "test-api-key")
      .query({
        memberId: "mem_001"
      })
      .expect(200);

    expect(response.body).toMatchObject({
      success: true,
      code: "PLUGIN_LIST_FOUND",
      data: []
    });
  });
});
