import { describe, expect, it } from "vitest";

import { loadEnv } from "./env.js";

describe("loadEnv", () => {
  it("loads defaults and configured values", () => {
    expect(
      loadEnv({
        PORT: "3001",
        API_KEY: " secret ",
        KINTONE_BASE_URL: " https://example.cybozu.com ",
        KINTONE_API_TOKEN: " token ",
        KINTONE_APP_CUSTOMERS: "100",
        KINTONE_APP_CONTRACTS: "101",
        KINTONE_APP_LICENSES: "102",
        KINTONE_APP_PLUGINS: "103",
        KINTONE_APP_PLUGIN_VERSIONS: "104",
        KINTONE_APP_REGISTERED_DOMAINS: "105",
        KINTONE_APP_AUTH_LOGS: "106",
        KINTONE_APP_DOWNLOAD_LOGS: "107"
      })
    ).toEqual({
      port: 3001,
      apiKey: "secret",
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
    });
  });

  it("rejects invalid ports", () => {
    expect(() => loadEnv({ PORT: "70000" })).toThrow("PORT must be an integer between 1 and 65535.");
  });
});
