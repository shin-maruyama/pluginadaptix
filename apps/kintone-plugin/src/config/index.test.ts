import type { LicenseAuthenticateResponse } from "@pluginadaptix/shared";
import { describe, expect, it } from "vitest";

import { LicenseClientError } from "../api/license-client.js";
import {
  authenticateConfig,
  CONFIG_MESSAGES,
  createAuthenticateRequest,
  getInitialConfigValues,
  validateConfigValues,
  type AuthenticateConfigDependencies,
  type ConfigValues
} from "./index.js";

const configValues: ConfigValues = {
  apiBaseUrl: "https://api.example.com/v1",
  apiKey: "api-key",
  pluginId: "plugin_001",
  licenseKey: "LIC-TEST-0001"
};

const authenticateResponse: LicenseAuthenticateResponse = {
  success: true,
  code: "LICENSE_ACTIVE",
  message: "ok",
  data: {
    licenseId: "LIC-000001",
    licenseStatus: "active",
    contractStatus: "active",
    pluginId: "plugin_001",
    pluginName: "Sample Plugin",
    expireDate: "2999-12-31",
    registeredDomain: "example.cybozu.com",
    maxDomains: 1,
    currentDomains: 1
  }
};

describe("validateConfigValues", () => {
  it("trims and accepts required values", () => {
    expect(
      validateConfigValues({
        apiBaseUrl: " https://api.example.com/v1 ",
        apiKey: " api-key ",
        pluginId: " plugin_001 ",
        licenseKey: " LIC-TEST-0001 "
      })
    ).toEqual(configValues);
  });

  it("rejects missing license keys", () => {
    expect(
      validateConfigValues({
        apiBaseUrl: "https://api.example.com/v1",
        apiKey: "api-key",
        pluginId: "plugin_001",
        licenseKey: ""
      })
    ).toBeUndefined();
  });
});

describe("getInitialConfigValues", () => {
  it("restores existing kintone plugin config values", () => {
    expect(getInitialConfigValues(configValues)).toEqual(configValues);
  });

  it("defaults missing config fields to empty strings", () => {
    expect(getInitialConfigValues({})).toEqual({
      apiBaseUrl: "",
      apiKey: "",
      pluginId: "",
      licenseKey: ""
    });
  });
});

describe("createAuthenticateRequest", () => {
  it("builds the POST /v1/licenses/authenticate payload", () => {
    expect(
      createAuthenticateRequest({
        values: configValues,
        kintoneDomain: "example.cybozu.com",
        appId: "123"
      })
    ).toEqual({
      licenseKey: "LIC-TEST-0001",
      pluginId: "plugin_001",
      pluginVersion: "0.1.0",
      kintoneDomain: "example.cybozu.com",
      appId: "123",
      environment: "production"
    });
  });
});

describe("authenticateConfig", () => {
  it("returns persisted config only after authentication succeeds", async () => {
    const calls: Array<{ licenseKey: string; pluginId: string }> = [];
    const dependencies: AuthenticateConfigDependencies = {
      createClient: () => ({
        async authenticate(request): Promise<LicenseAuthenticateResponse> {
          calls.push({
            licenseKey: request.licenseKey,
            pluginId: request.pluginId
          });
          return authenticateResponse;
        }
      })
    };

    await expect(
      authenticateConfig(
        {
          values: configValues,
          kintoneDomain: "example.cybozu.com",
          appId: "123"
        },
        dependencies
      )
    ).resolves.toEqual({
      success: true,
      config: {
        ...configValues,
        kintoneDomain: "example.cybozu.com"
      },
      response: authenticateResponse
    });
    expect(calls).toEqual([
      {
        licenseKey: "LIC-TEST-0001",
        pluginId: "plugin_001"
      }
    ]);
  });

  it("returns API error messages without persisted config", async () => {
    const dependencies: AuthenticateConfigDependencies = {
      createClient: () => ({
        async authenticate(): Promise<LicenseAuthenticateResponse> {
          throw new LicenseClientError(403, "License expired.");
        }
      })
    };

    await expect(
      authenticateConfig(
        {
          values: configValues,
          kintoneDomain: "example.cybozu.com",
          appId: "123"
        },
        dependencies
      )
    ).resolves.toEqual({
      success: false,
      message: "License expired."
    });
  });

  it("returns a generic message for unexpected errors", async () => {
    const dependencies: AuthenticateConfigDependencies = {
      createClient: () => ({
        async authenticate(): Promise<LicenseAuthenticateResponse> {
          throw new Error("network failed");
        }
      })
    };

    await expect(
      authenticateConfig(
        {
          values: configValues,
          kintoneDomain: "example.cybozu.com",
          appId: "123"
        },
        dependencies
      )
    ).resolves.toEqual({
      success: false,
      message: CONFIG_MESSAGES.failed
    });
  });
});
