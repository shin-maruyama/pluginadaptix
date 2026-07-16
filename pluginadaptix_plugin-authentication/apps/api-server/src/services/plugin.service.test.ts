import { describe, expect, it } from "vitest";

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
import { PluginService } from "./plugin.service.js";

class FakePluginRepository implements PluginRepository {
  public plugin?: PluginEntity;
  public latestVersion?: PluginVersionEntity;
  public customer?: CustomerEntity;
  public contracts: ContractEntity[] = [];
  public licenses: LicenseEntity[] = [];
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

function createRepository(): FakePluginRepository {
  const repository = new FakePluginRepository();
  repository.plugin = {
    pluginId: "plugin_001",
    pluginName: "Sample Plugin",
    publishStatus: "public",
    latestVersion: "1.2.0",
    forceUpdateVersion: "1.1.0"
  };
  repository.latestVersion = {
    versionId: "VER-000001",
    pluginId: "plugin_001",
    version: "1.2.0",
    releaseStatus: "published",
    releaseDate: "2026-01-10",
    releaseNote: "Bug fixes",
    isLatest: "true",
    isForceUpdate: "false"
  };
  return repository;
}

describe("PluginService.getVersion", () => {
  it("returns latest version details and update flags", async () => {
    const service = new PluginService(createRepository());

    await expect(
      service.getVersion({
        pluginId: "plugin_001",
        currentVersion: "1.0.0"
      })
    ).resolves.toEqual({
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

  it("does not require updates when current version is latest", async () => {
    const repository = createRepository();
    repository.plugin = {
      pluginId: "plugin_001",
      pluginName: "Sample Plugin",
      publishStatus: "public",
      latestVersion: "1.2.0"
    };
    const service = new PluginService(repository);

    await expect(
      service.getVersion({
        pluginId: "plugin_001",
        currentVersion: "1.2.0"
      })
    ).resolves.toMatchObject({
      data: {
        updateRequired: false,
        forceUpdate: false
      }
    });
  });

  it("rejects missing plugins", async () => {
    const service = new PluginService(createRepository());

    await expect(
      service.getVersion({
        pluginId: "missing",
        currentVersion: "1.0.0"
      })
    ).rejects.toMatchObject({
      status: 404,
      response: {
        code: "PLUGIN_NOT_FOUND"
      }
    });
  });

  it("rejects private plugins", async () => {
    const repository = createRepository();
    repository.plugin = {
      pluginId: "plugin_001",
      pluginName: "Sample Plugin",
      publishStatus: "private",
      latestVersion: "1.2.0"
    };
    const service = new PluginService(repository);

    await expect(
      service.getVersion({
        pluginId: "plugin_001",
        currentVersion: "1.0.0"
      })
    ).rejects.toMatchObject({
      status: 403,
      response: {
        code: "PLUGIN_NOT_ALLOWED"
      }
    });
  });

  it("rejects deprecated plugins", async () => {
    const repository = createRepository();
    repository.plugin = {
      pluginId: "plugin_001",
      pluginName: "Sample Plugin",
      publishStatus: "deprecated",
      latestVersion: "1.2.0"
    };
    const service = new PluginService(repository);

    await expect(
      service.getVersion({
        pluginId: "plugin_001",
        currentVersion: "1.0.0"
      })
    ).rejects.toMatchObject({
      status: 403,
      response: {
        code: "PLUGIN_NOT_ALLOWED"
      }
    });
  });
});

describe("PluginService.createDownloadToken", () => {
  it("creates a short download token and writes a download log", async () => {
    const repository = createRepository();
    repository.customer = {
      customerId: "CUS-000001",
      wordpressUserId: "mem_001"
    };
    repository.contracts = [
      {
        contractId: "CON-000001",
        customerId: "CUS-000001",
        contractStatus: "active",
        contractEnd: "2999-12-31"
      }
    ];
    repository.licenses = [
      {
        licenseId: "LIC-000001",
        customerId: "CUS-000001",
        contractId: "CON-000001",
        pluginId: "plugin_001",
        licenseStatus: "active",
        expireDate: "2999-12-31"
      }
    ];
    const service = new PluginService(repository);

    const result = await service.createDownloadToken(
      {
        memberId: "mem_001",
        pluginId: "plugin_001",
        licenseKey: "LIC-TEST-0001"
      },
      {
        ipAddress: "127.0.0.1",
        userAgent: "vitest"
      }
    );

    expect(result.success).toBe(true);
    expect(result.code).toBe("DOWNLOAD_TOKEN_CREATED");
    expect(result.data.expiresIn).toBe(300);
    expect(result.data.downloadUrl).toMatch(
      /^http:\/\/localhost:3000\/v1\/plugins\/download\?token=/
    );
    expect(repository.downloadLogs).toHaveLength(1);
    expect(repository.downloadLogs[0]).toMatchObject({
      customerId: "CUS-000001",
      pluginId: "plugin_001",
      versionId: "VER-000001",
      version: "1.2.0",
      downloadResult: "success",
      ipAddress: "127.0.0.1",
      userAgent: "vitest"
    });
  });

  it("rejects invalid license keys", async () => {
    const repository = createRepository();
    repository.customer = {
      customerId: "CUS-000001",
      wordpressUserId: "mem_001"
    };
    repository.licenses = [
      {
        licenseId: "LIC-000001",
        customerId: "CUS-000001",
        contractId: "CON-000001",
        pluginId: "plugin_001",
        licenseStatus: "active",
        expireDate: "2999-12-31"
      }
    ];
    const service = new PluginService(repository);

    await expect(
      service.createDownloadToken({
        memberId: "mem_001",
        pluginId: "plugin_001",
        licenseKey: "wrong"
      })
    ).rejects.toMatchObject({
      status: 401,
      response: {
        code: "INVALID_LICENSE_KEY"
      }
    });
  });

  it("rejects expired licenses", async () => {
    const repository = createRepository();
    repository.customer = {
      customerId: "CUS-000001",
      wordpressUserId: "mem_001"
    };
    repository.contracts = [
      {
        contractId: "CON-000001",
        customerId: "CUS-000001",
        contractStatus: "active",
        contractEnd: "2999-12-31"
      }
    ];
    repository.licenses = [
      {
        licenseId: "LIC-000001",
        customerId: "CUS-000001",
        contractId: "CON-000001",
        pluginId: "plugin_001",
        licenseStatus: "active",
        expireDate: "2000-01-01"
      }
    ];
    const service = new PluginService(repository);

    await expect(
      service.createDownloadToken({
        memberId: "mem_001",
        pluginId: "plugin_001",
        licenseKey: "LIC-TEST-0001"
      })
    ).rejects.toMatchObject({
      status: 403,
      response: {
        code: "LICENSE_EXPIRED"
      }
    });
  });

  it("rejects private plugins", async () => {
    const repository = createRepository();
    repository.plugin = {
      pluginId: "plugin_001",
      pluginName: "Sample Plugin",
      publishStatus: "private",
      latestVersion: "1.2.0"
    };
    repository.customer = {
      customerId: "CUS-000001",
      wordpressUserId: "mem_001"
    };
    repository.contracts = [
      {
        contractId: "CON-000001",
        customerId: "CUS-000001",
        contractStatus: "active",
        contractEnd: "2999-12-31"
      }
    ];
    repository.licenses = [
      {
        licenseId: "LIC-000001",
        customerId: "CUS-000001",
        contractId: "CON-000001",
        pluginId: "plugin_001",
        licenseStatus: "active",
        expireDate: "2999-12-31"
      }
    ];
    const service = new PluginService(repository);

    await expect(
      service.createDownloadToken({
        memberId: "mem_001",
        pluginId: "plugin_001",
        licenseKey: "LIC-TEST-0001"
      })
    ).rejects.toMatchObject({
      status: 403,
      response: {
        code: "PLUGIN_NOT_ALLOWED"
      }
    });
  });
});

describe("PluginService.listPlugins", () => {
  it("returns public licensed plugins and download availability", async () => {
    const repository = createRepository();
    repository.customer = {
      customerId: "CUS-000001",
      wordpressUserId: "mem_001"
    };
    repository.contracts = [
      {
        contractId: "CON-000001",
        customerId: "CUS-000001",
        contractStatus: "active",
        contractEnd: "2999-12-31"
      }
    ];
    repository.licenses = [
      {
        licenseId: "LIC-000001",
        customerId: "CUS-000001",
        contractId: "CON-000001",
        pluginId: "plugin_001",
        licenseStatus: "active",
        expireDate: "2999-12-31"
      }
    ];
    const service = new PluginService(repository);

    await expect(service.listPlugins({ memberId: "mem_001" })).resolves.toEqual({
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

  it("filters private plugins", async () => {
    const repository = createRepository();
    repository.plugin = {
      pluginId: "plugin_001",
      pluginName: "Sample Plugin",
      publishStatus: "private",
      latestVersion: "1.2.0"
    };
    repository.customer = {
      customerId: "CUS-000001",
      wordpressUserId: "mem_001"
    };
    repository.contracts = [
      {
        contractId: "CON-000001",
        customerId: "CUS-000001",
        contractStatus: "active",
        contractEnd: "2999-12-31"
      }
    ];
    repository.licenses = [
      {
        licenseId: "LIC-000001",
        customerId: "CUS-000001",
        contractId: "CON-000001",
        pluginId: "plugin_001",
        licenseStatus: "active",
        expireDate: "2999-12-31"
      }
    ];
    const service = new PluginService(repository);

    await expect(service.listPlugins({ memberId: "mem_001" })).resolves.toMatchObject({
      data: []
    });
  });

  it("marks downloads unavailable for expired contracts", async () => {
    const repository = createRepository();
    repository.customer = {
      customerId: "CUS-000001",
      wordpressUserId: "mem_001"
    };
    repository.contracts = [
      {
        contractId: "CON-000001",
        customerId: "CUS-000001",
        contractStatus: "active",
        contractEnd: "2000-01-01"
      }
    ];
    repository.licenses = [
      {
        licenseId: "LIC-000001",
        customerId: "CUS-000001",
        contractId: "CON-000001",
        pluginId: "plugin_001",
        licenseStatus: "active",
        expireDate: "2999-12-31"
      }
    ];
    const service = new PluginService(repository);

    await expect(service.listPlugins({ memberId: "mem_001" })).resolves.toMatchObject({
      data: [
        {
          downloadAvailable: false
        }
      ]
    });
  });

  it("returns an empty list when member is unknown", async () => {
    const service = new PluginService(createRepository());

    await expect(service.listPlugins({ memberId: "missing" })).resolves.toMatchObject({
      data: []
    });
  });
});
