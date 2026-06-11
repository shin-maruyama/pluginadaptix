import { describe, expect, it } from "vitest";

import {
  createLicenseClient,
  LicenseClientError,
  normalizeBaseUrl,
  type LicenseClientFetch
} from "./license-client.js";

describe("normalizeBaseUrl", () => {
  it("trims trailing slashes", () => {
    expect(normalizeBaseUrl(" https://api.example.com/v1/// ")).toBe(
      "https://api.example.com/v1"
    );
  });
});

describe("createLicenseClient", () => {
  it("posts license authentication requests", async () => {
    const calls: Array<{ input: string; init: Parameters<LicenseClientFetch>[1] }> = [];
    const fetcher: LicenseClientFetch = async (input, init) => {
      calls.push({ input, init });
      return {
        ok: true,
        status: 200,
        async json(): Promise<unknown> {
          return {
            success: true,
            code: "LICENSE_ACTIVE",
            message: "ok",
            data: {
              licenseId: "LIC-000001",
              licenseStatus: "active",
              contractStatus: "active",
              pluginId: "plugin_001",
              pluginName: "Sample",
              expireDate: "2999-12-31",
              registeredDomain: "example.cybozu.com",
              maxDomains: 1,
              currentDomains: 1
            }
          };
        }
      };
    };
    const client = createLicenseClient(
      {
        apiBaseUrl: "https://api.example.com/v1/",
        apiKey: "api-key"
      },
      fetcher
    );

    const result = await client.authenticate({
      licenseKey: "LIC-TEST",
      pluginId: "plugin_001",
      pluginVersion: "0.1.0",
      kintoneDomain: "example.cybozu.com"
    });

    expect(result.success).toBe(true);
    expect(calls).toHaveLength(1);
    expect(calls[0]).toMatchObject({
      input: "https://api.example.com/v1/licenses/authenticate",
      init: {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": "api-key"
        }
      }
    });
    expect(JSON.parse(calls[0]?.init.body ?? "{}")).toMatchObject({
      licenseKey: "LIC-TEST",
      pluginId: "plugin_001"
    });
  });

  it("builds status query parameters", async () => {
    let calledUrl = "";
    const fetcher: LicenseClientFetch = async (input) => {
      calledUrl = input;
      return {
        ok: true,
        status: 200,
        async json(): Promise<unknown> {
          return {
            success: true,
            code: "LICENSE_ACTIVE",
            message: "ok",
            data: {
              licenseStatus: "active",
              expireDate: "2999-12-31",
              daysRemaining: 100,
              available: true
            }
          };
        }
      };
    };
    const client = createLicenseClient(
      {
        apiBaseUrl: "https://api.example.com/v1",
        apiKey: "api-key"
      },
      fetcher
    );

    await client.getStatus({
      licenseKey: "LIC-TEST",
      pluginId: "plugin_001",
      kintoneDomain: "example.cybozu.com"
    });

    const url = new URL(calledUrl);
    expect(url.pathname).toBe("/v1/licenses/status");
    expect(url.searchParams.get("licenseKey")).toBe("LIC-TEST");
    expect(url.searchParams.get("pluginId")).toBe("plugin_001");
    expect(url.searchParams.get("kintoneDomain")).toBe("example.cybozu.com");
  });

  it("throws common API errors", async () => {
    const fetcher: LicenseClientFetch = async () => ({
      ok: false,
      status: 403,
      async json(): Promise<unknown> {
        return {
          success: false,
          code: "LICENSE_EXPIRED",
          message: "License expired.",
          data: null
        };
      }
    });
    const client = createLicenseClient(
      {
        apiBaseUrl: "https://api.example.com/v1",
        apiKey: "api-key"
      },
      fetcher
    );

    await expect(
      client.getStatus({
        licenseKey: "LIC-TEST",
        pluginId: "plugin_001",
        kintoneDomain: "example.cybozu.com"
      })
    ).rejects.toBeInstanceOf(LicenseClientError);
  });
});
