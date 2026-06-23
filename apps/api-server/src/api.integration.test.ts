import { describe, expect, it } from "vitest";
import request from "supertest";

import {
  KintoneClient,
  type KintoneFieldValue,
  type KintoneRecord,
  type KintoneRecordInput
} from "@pluginadaptix/kintone-client";

import { createApp } from "./app.js";
import type { Env, KintoneAppEnv } from "./config/env.js";
import { KintoneLicenseRepository } from "./repositories/license.repository.js";
import { KintonePluginRepository } from "./repositories/plugin.repository.js";
import { createLicenseKeyHash } from "./utils/license-key.js";

const API_KEY = "test-api-key";
const ACTIVE_LICENSE_KEY = "LIC-ACTIVE-0001";
const EXPIRED_LICENSE_KEY = "LIC-EXPIRED-0001";
const SUSPENDED_LICENSE_KEY = "LIC-SUSPENDED-0001";
const UNKNOWN_LICENSE_KEY = "LIC-NOT-FOUND-0001";
const APP_IDS: KintoneAppEnv = {
  customers: "100",
  contracts: "101",
  licenses: "102",
  plugins: "103",
  pluginVersions: "104",
  registeredDomains: "105",
  authLogs: "106",
  downloadLogs: "107"
};

interface FixtureOptions {
  contractEnd?: string;
  contractStatus?: string;
  licenseExpireDate?: string;
  licenseStatus?: string;
}

class MockKintoneApi {
  public readonly fetch: typeof fetch = async (input, init) => {
    const url = new URL(typeof input === "string" ? input : input instanceof URL ? input.href : input.url);
    const method = init?.method ?? "GET";

    if (method === "GET" && url.pathname.endsWith("/records.json")) {
      const app = url.searchParams.get("app") ?? "";
      const query = url.searchParams.get("query") ?? "";

      return this.json({
        records: this.findRecords(app, query)
      });
    }

    if (method === "POST" && url.pathname.endsWith("/record.json")) {
      const body = parseJsonBody(init);
      const app = readAppId(body);
      const record = readRecordInput(body);

      if (app === "" || record === undefined) {
        return this.json({ message: "Bad request." }, 400);
      }

      this.recordsFor(app).push(record);

      return this.json({
        id: String(this.recordsFor(app).length),
        revision: "1"
      });
    }

    if (method === "PUT" && url.pathname.endsWith("/record.json")) {
      const body = parseJsonBody(init);
      const app = readAppId(body);
      const record = readRecordInput(body);
      const updateKey = readUpdateKey(body);

      if (app === "" || record === undefined || updateKey === undefined) {
        return this.json({ message: "Bad request." }, 400);
      }

      const targetRecord = this.recordsFor(app).find(
        (item) => readString(item, updateKey.field) === updateKey.value
      );

      if (targetRecord !== undefined) {
        Object.assign(targetRecord, record);
      }

      return this.json({
        revision: "2"
      });
    }

    return this.json({ message: "Not found." }, 404);
  };

  public constructor(private readonly store: Map<string, KintoneRecord[]>) {}

  public recordsFor(app: string): KintoneRecord[] {
    const records = this.store.get(app);

    if (records !== undefined) {
      return records;
    }

    const createdRecords: KintoneRecord[] = [];
    this.store.set(app, createdRecords);

    return createdRecords;
  }

  private findRecords(app: string, query: string): KintoneRecord[] {
    return this.recordsFor(app).filter(
      (record) => matchesEquals(record, query) && matchesIn(record, query)
    );
  }

  private json(body: unknown, status = 200): Response {
    return new Response(JSON.stringify(body), {
      headers: {
        "Content-Type": "application/json"
      },
      status
    });
  }
}

function createFixture(options: FixtureOptions = {}): {
  app: ReturnType<typeof createApp>;
  kintone: MockKintoneApi;
} {
  const kintone = new MockKintoneApi(createStore(options));
  const client = new KintoneClient({
    baseUrl: "https://mock.cybozu.com",
    apiToken: "mock-token",
    fetch: kintone.fetch
  });
  const env = createTestEnv();

  return {
    app: createApp({
      env,
      licenseRepository: new KintoneLicenseRepository(client, env.kintoneApps),
      pluginRepository: new KintonePluginRepository(client, env.kintoneApps)
    }),
    kintone
  };
}

function createTestEnv(): Env {
  return {
    port: 3000,
    apiKey: API_KEY,
    kintoneBaseUrl: "https://mock.cybozu.com",
    kintoneApiToken: "mock-token",
    kintoneApps: APP_IDS
  };
}

function createStore(options: FixtureOptions): Map<string, KintoneRecord[]> {
  return new Map<string, KintoneRecord[]>([
    [
      APP_IDS.customers,
      [
        createRecord({
          customer_id: "CUS-000001",
          wordpress_user_id: "mem_001"
        })
      ]
    ],
    [
      APP_IDS.contracts,
      [
        createRecord({
          contract_id: "CON-000001",
          customer_id: "CUS-000001",
          contract_status: options.contractStatus ?? "active",
          contract_end: options.contractEnd ?? "2999-12-31"
        })
      ]
    ],
    [
      APP_IDS.licenses,
      [
        createRecord({
          license_id: "LIC-000001",
          license_key_hash: createLicenseKeyHash(ACTIVE_LICENSE_KEY),
          customer_id: "CUS-000001",
          contract_id: "CON-000001",
          plugin_id: "plugin_001",
          license_status: options.licenseStatus ?? "active",
          expire_date: options.licenseExpireDate ?? "2999-12-31",
          max_domain_count: 2,
          current_domain_count: 1
        }),
        createRecord({
          license_id: "LIC-000002",
          license_key_hash: createLicenseKeyHash(EXPIRED_LICENSE_KEY),
          customer_id: "CUS-000001",
          contract_id: "CON-000001",
          plugin_id: "plugin_001",
          license_status: "active",
          expire_date: "2000-01-01",
          max_domain_count: 2,
          current_domain_count: 1
        }),
        createRecord({
          license_id: "LIC-000003",
          license_key_hash: createLicenseKeyHash(SUSPENDED_LICENSE_KEY),
          customer_id: "CUS-000001",
          contract_id: "CON-000001",
          plugin_id: "plugin_001",
          license_status: "suspended",
          expire_date: "2999-12-31",
          max_domain_count: 2,
          current_domain_count: 1
        })
      ]
    ],
    [
      APP_IDS.plugins,
      [
        createRecord({
          plugin_id: "plugin_001",
          plugin_name: "Sample Plugin",
          publish_status: "public",
          latest_version: "1.2.0",
          force_update_version: "1.1.0"
        })
      ]
    ],
    [
      APP_IDS.pluginVersions,
      [
        createRecord({
          version_id: "VER-000001",
          plugin_id: "plugin_001",
          version: "1.2.0",
          release_status: "published",
          release_date: "2026-01-10",
          release_note: "Bug fixes",
          is_latest: "true",
          is_force_update: "false"
        })
      ]
    ],
    [
      APP_IDS.registeredDomains,
      [
        createRecord({
          domain_id: "DOM-000001",
          license_id: "LIC-000001",
          license_key: "LIC-****-0001",
          kintone_domain: "sample.cybozu.com",
          domain_status: "active"
        }),
        createRecord({
          domain_id: "DOM-000002",
          license_id: "LIC-000002",
          license_key: "LIC-****-0001",
          kintone_domain: "sample.cybozu.com",
          domain_status: "active"
        }),
        createRecord({
          domain_id: "DOM-000003",
          license_id: "LIC-000003",
          license_key: "LIC-****-0001",
          kintone_domain: "sample.cybozu.com",
          domain_status: "active"
        })
      ]
    ],
    [APP_IDS.authLogs, []],
    [APP_IDS.downloadLogs, []]
  ]);
}

function createRecord(values: Record<string, KintoneFieldValue>): KintoneRecord {
  const record: KintoneRecord = {};

  for (const [key, value] of Object.entries(values)) {
    record[key] = { value };
  }

  return record;
}

function parseJsonBody(init: RequestInit | undefined): unknown {
  if (typeof init?.body !== "string") {
    return {};
  }

  return JSON.parse(init.body) as unknown;
}

function readAppId(body: unknown): string {
  if (!isRecord(body)) {
    return "";
  }

  const app = body.app;

  if (typeof app === "string" || typeof app === "number") {
    return String(app);
  }

  return "";
}

function readRecordInput(body: unknown): KintoneRecordInput | undefined {
  if (!isRecord(body) || !isRecord(body.record)) {
    return undefined;
  }

  const input: KintoneRecordInput = {};

  for (const [field, rawFieldValue] of Object.entries(body.record)) {
    if (!isRecord(rawFieldValue) || !isKintoneFieldValue(rawFieldValue.value)) {
      return undefined;
    }

    input[field] = {
      value: rawFieldValue.value
    };
  }

  return input;
}

function readUpdateKey(body: unknown): { field: string; value: string } | undefined {
  if (!isRecord(body) || !isRecord(body.updateKey)) {
    return undefined;
  }

  const { field, value } = body.updateKey;

  if (typeof field !== "string" || typeof value !== "string") {
    return undefined;
  }

  return { field, value };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isKintoneFieldValue(value: unknown): value is KintoneFieldValue {
  if (value === null) {
    return true;
  }

  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return true;
  }

  if (Array.isArray(value)) {
    return value.every(
      (item) =>
        item === null ||
        typeof item === "string" ||
        typeof item === "number" ||
        typeof item === "boolean"
    );
  }

  return isRecord(value);
}

function readString(record: KintoneRecord, field: string): string {
  const value = record[field]?.value;

  return typeof value === "string" ? value : "";
}

function matchesEquals(record: KintoneRecord, query: string): boolean {
  const equalsPattern = /([A-Za-z0-9_]+) = "((?:\\.|[^"])*)"/g;

  for (const match of query.matchAll(equalsPattern)) {
    const field = match[1];
    const rawValue = match[2];

    if (field === undefined || rawValue === undefined) {
      continue;
    }

    if (readString(record, field) !== unescapeQueryValue(rawValue)) {
      return false;
    }
  }

  return true;
}

function matchesIn(record: KintoneRecord, query: string): boolean {
  const inPattern = /([A-Za-z0-9_]+) in \(([^)]*)\)/g;

  for (const match of query.matchAll(inPattern)) {
    const field = match[1];
    const rawValues = match[2];

    if (field === undefined || rawValues === undefined) {
      continue;
    }

    const values = [...rawValues.matchAll(/"((?:\\.|[^"])*)"/g)]
      .map((valueMatch) => valueMatch[1])
      .filter((value): value is string => value !== undefined)
      .map(unescapeQueryValue);

    if (!values.includes(readString(record, field))) {
      return false;
    }
  }

  return true;
}

function unescapeQueryValue(value: string): string {
  return value.replace(/\\"/g, '"').replace(/\\\\/g, "\\");
}

function expectCommonResponse(body: unknown): void {
  expect(isRecord(body)).toBe(true);

  if (!isRecord(body)) {
    return;
  }

  expect(typeof body.success).toBe("boolean");
  expect(typeof body.code).toBe("string");
  expect(typeof body.message).toBe("string");
  expect(Object.prototype.hasOwnProperty.call(body, "data")).toBe(true);
}

function expectErrorBody(body: unknown, code: string, message: string): void {
  expectCommonResponse(body);
  expect(body).toEqual({
    success: false,
    code,
    message,
    data: null
  });
}

describe("API integration", () => {
  it("rejects invalid API keys for implemented API routes", async () => {
    const { app } = createFixture();
    const responses = await Promise.all([
      request(app).post("/v1/licenses/authenticate").set("X-API-Key", "invalid").send({
        licenseKey: ACTIVE_LICENSE_KEY,
        pluginId: "plugin_001",
        pluginVersion: "1.0.0",
        kintoneDomain: "sample.cybozu.com"
      }),
      request(app).get("/v1/licenses/status").set("X-API-Key", "invalid").query({
        licenseKey: ACTIVE_LICENSE_KEY,
        pluginId: "plugin_001",
        kintoneDomain: "sample.cybozu.com"
      }),
      request(app).post("/v1/licenses/deactivate").set("X-API-Key", "invalid").send({
        licenseKey: ACTIVE_LICENSE_KEY,
        pluginId: "plugin_001",
        kintoneDomain: "sample.cybozu.com"
      }),
      request(app).get("/v1/plugins/version").set("X-API-Key", "invalid").query({
        pluginId: "plugin_001",
        currentVersion: "1.0.0"
      }),
      request(app).get("/v1/plugins").set("X-API-Key", "invalid").query({
        memberId: "mem_001"
      }),
      request(app).post("/v1/plugins/download-token").set("X-API-Key", "invalid").send({
        memberId: "mem_001",
        pluginId: "plugin_001",
        licenseKey: ACTIVE_LICENSE_KEY
      })
    ]);

    for (const response of responses) {
      expect(response.status).toBe(401);
      expectErrorBody(response.body, "INVALID_API_KEY", "Invalid API key.");
    }
  });
});

describe("License API integration", () => {
  it("authenticates active licenses and writes auth records through the kintone client", async () => {
    const { app, kintone } = createFixture();

    const response = await request(app)
      .post("/v1/licenses/authenticate")
      .set("X-API-Key", API_KEY)
      .send({
        licenseKey: ACTIVE_LICENSE_KEY,
        pluginId: "plugin_001",
        pluginVersion: "1.0.0",
        kintoneDomain: "new.cybozu.com",
        appId: "123",
        environment: "production"
      })
      .expect(200);

    expectCommonResponse(response.body);
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
    expect(kintone.recordsFor(APP_IDS.registeredDomains)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          kintone_domain: { value: "new.cybozu.com" },
          domain_status: { value: "active" }
        })
      ])
    );
    expect(kintone.recordsFor(APP_IDS.authLogs)).toEqual([
      expect.objectContaining({
        event_type: { value: "authenticate" },
        result_status: { value: "success" },
        license_key: { value: "LIC-****-****-0001" }
      })
    ]);
  });

  it("returns active license status and updates auth metadata", async () => {
    const { app, kintone } = createFixture();

    const response = await request(app)
      .get("/v1/licenses/status")
      .set("X-API-Key", API_KEY)
      .query({
        licenseKey: ACTIVE_LICENSE_KEY,
        pluginId: "plugin_001",
        kintoneDomain: "sample.cybozu.com"
      })
      .expect(200);

    expectCommonResponse(response.body);
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
    expect(kintone.recordsFor(APP_IDS.licenses)[0]).toMatchObject({
      last_auth_result: { value: "success" }
    });
    expect(kintone.recordsFor(APP_IDS.authLogs)).toEqual([
      expect.objectContaining({
        event_type: { value: "status" },
        result_status: { value: "success" }
      })
    ]);
  });

  it("deactivates registered domains", async () => {
    const { app, kintone } = createFixture();

    const response = await request(app)
      .post("/v1/licenses/deactivate")
      .set("X-API-Key", API_KEY)
      .send({
        licenseKey: ACTIVE_LICENSE_KEY,
        pluginId: "plugin_001",
        kintoneDomain: "sample.cybozu.com",
        reason: "user_deactivated"
      })
      .expect(200);

    expectCommonResponse(response.body);
    expect(response.body).toMatchObject({
      success: true,
      code: "LICENSE_DEACTIVATED",
      message: "License domain deactivated.",
      data: {
        licenseStatus: "inactive"
      }
    });
    expect(typeof response.body.data.deactivatedAt).toBe("string");
    expect(kintone.recordsFor(APP_IDS.registeredDomains)[0]).toMatchObject({
      domain_status: { value: "deactivated" }
    });
    expect(kintone.recordsFor(APP_IDS.licenses)[0]).toMatchObject({
      current_domain_count: { value: 0 },
      last_auth_result: { value: "deactivated" }
    });
  });

  it("returns license-not-found errors", async () => {
    const { app } = createFixture();

    const response = await request(app)
      .get("/v1/licenses/status")
      .set("X-API-Key", API_KEY)
      .query({
        licenseKey: UNKNOWN_LICENSE_KEY,
        pluginId: "plugin_001",
        kintoneDomain: "sample.cybozu.com"
      })
      .expect(404);

    expectErrorBody(response.body, "LICENSE_NOT_FOUND", "License was not found.");
  });

  it("returns expired license errors", async () => {
    const { app } = createFixture();

    const response = await request(app)
      .get("/v1/licenses/status")
      .set("X-API-Key", API_KEY)
      .query({
        licenseKey: EXPIRED_LICENSE_KEY,
        pluginId: "plugin_001",
        kintoneDomain: "sample.cybozu.com"
      })
      .expect(403);

    expectErrorBody(response.body, "LICENSE_EXPIRED", "License has expired.");
  });

  it("returns suspended license errors", async () => {
    const { app } = createFixture();

    const response = await request(app)
      .get("/v1/licenses/status")
      .set("X-API-Key", API_KEY)
      .query({
        licenseKey: SUSPENDED_LICENSE_KEY,
        pluginId: "plugin_001",
        kintoneDomain: "sample.cybozu.com"
      })
      .expect(403);

    expectErrorBody(response.body, "LICENSE_SUSPENDED", "License is suspended.");
  });

  it("returns plugin mismatch errors", async () => {
    const { app } = createFixture();

    const response = await request(app)
      .get("/v1/licenses/status")
      .set("X-API-Key", API_KEY)
      .query({
        licenseKey: ACTIVE_LICENSE_KEY,
        pluginId: "plugin_other",
        kintoneDomain: "sample.cybozu.com"
      })
      .expect(403);

    expectErrorBody(response.body, "PLUGIN_MISMATCH", "Plugin does not match.");
  });

  it("returns domain mismatch errors", async () => {
    const { app } = createFixture();

    const response = await request(app)
      .post("/v1/licenses/deactivate")
      .set("X-API-Key", API_KEY)
      .send({
        licenseKey: ACTIVE_LICENSE_KEY,
        pluginId: "plugin_001",
        kintoneDomain: "missing.cybozu.com"
      })
      .expect(403);

    expectErrorBody(response.body, "DOMAIN_MISMATCH", "Domain does not match.");
  });
});

describe("Plugin API integration", () => {
  it("returns plugin version details", async () => {
    const { app } = createFixture();

    const response = await request(app)
      .get("/v1/plugins/version")
      .set("X-API-Key", API_KEY)
      .query({
        pluginId: "plugin_001",
        currentVersion: "1.0.0"
      })
      .expect(200);

    expectCommonResponse(response.body);
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

  it("returns plugin lists with download availability", async () => {
    const { app } = createFixture();

    const response = await request(app)
      .get("/v1/plugins")
      .set("X-API-Key", API_KEY)
      .query({
        memberId: "mem_001"
      })
      .expect(200);

    expectCommonResponse(response.body);
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
        },
        {
          pluginId: "plugin_001",
          pluginName: "Sample Plugin",
          latestVersion: "1.2.0",
          licenseStatus: "active",
          downloadAvailable: false
        },
        {
          pluginId: "plugin_001",
          pluginName: "Sample Plugin",
          latestVersion: "1.2.0",
          licenseStatus: "suspended",
          downloadAvailable: false
        }
      ]
    });
  });

  it("marks downloads unavailable for expired contracts", async () => {
    const { app } = createFixture({
      contractEnd: "2000-01-01"
    });

    const response = await request(app)
      .get("/v1/plugins")
      .set("X-API-Key", API_KEY)
      .query({
        memberId: "mem_001"
      })
      .expect(200);

    expectCommonResponse(response.body);
    expect(response.body).toMatchObject({
      success: true,
      code: "PLUGIN_LIST_FOUND"
    });
    expect(response.body.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          licenseStatus: "active",
          downloadAvailable: false
        })
      ])
    );
  });

  it("creates download tokens and download logs", async () => {
    const { app, kintone } = createFixture();

    const response = await request(app)
      .post("/v1/plugins/download-token")
      .set("X-API-Key", API_KEY)
      .send({
        memberId: "mem_001",
        pluginId: "plugin_001",
        licenseKey: ACTIVE_LICENSE_KEY
      })
      .expect(200);

    expectCommonResponse(response.body);
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
    expect(kintone.recordsFor(APP_IDS.downloadLogs)).toEqual([
      expect.objectContaining({
        customer_id: { value: "CUS-000001" },
        plugin_id: { value: "plugin_001" },
        version_id: { value: "VER-000001" },
        version: { value: "1.2.0" },
        download_result: { value: "success" }
      })
    ]);
  });

  it("returns invalid license errors for missing download licenses", async () => {
    const { app } = createFixture();

    const response = await request(app)
      .post("/v1/plugins/download-token")
      .set("X-API-Key", API_KEY)
      .send({
        memberId: "mem_001",
        pluginId: "plugin_001",
        licenseKey: UNKNOWN_LICENSE_KEY
      })
      .expect(401);

    expectErrorBody(response.body, "INVALID_LICENSE_KEY", "License key is invalid.");
  });

  it("returns expired license errors for download token requests", async () => {
    const { app } = createFixture();

    const response = await request(app)
      .post("/v1/plugins/download-token")
      .set("X-API-Key", API_KEY)
      .send({
        memberId: "mem_001",
        pluginId: "plugin_001",
        licenseKey: EXPIRED_LICENSE_KEY
      })
      .expect(403);

    expectErrorBody(response.body, "LICENSE_EXPIRED", "License has expired.");
  });
});
