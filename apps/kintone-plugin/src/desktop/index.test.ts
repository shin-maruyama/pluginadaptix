import type { LicenseStatusResponse } from "@pluginadaptix/shared";
import { describe, expect, it } from "vitest";

import { LicenseClientError } from "../api/license-client.js";
import {
  checkLicenseStatus,
  createStatusView,
  DESKTOP_MESSAGES,
  parseDesktopConfig,
  type CheckLicenseStatusDependencies,
  type DesktopConfig
} from "./index.js";

const desktopConfig: DesktopConfig = {
  apiBaseUrl: "https://api.example.com/v1",
  apiKey: "api-key",
  licenseKey: "LIC-TEST-0001",
  pluginId: "plugin_001"
};

const activeResponse: LicenseStatusResponse = {
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

describe("parseDesktopConfig", () => {
  it("reads saved license settings", () => {
    expect(
      parseDesktopConfig({
        apiBaseUrl: " https://api.example.com/v1 ",
        apiKey: " api-key ",
        licenseKey: " LIC-TEST-0001 ",
        pluginId: " plugin_001 "
      })
    ).toEqual(desktopConfig);
  });

  it("returns undefined when settings are missing", () => {
    expect(
      parseDesktopConfig({
        apiBaseUrl: "https://api.example.com/v1",
        apiKey: "api-key",
        pluginId: "plugin_001"
      })
    ).toBeUndefined();
  });
});

describe("createStatusView", () => {
  it("allows normal operation for active licenses", () => {
    expect(createStatusView(activeResponse)).toEqual({
      level: "info",
      message: DESKTOP_MESSAGES.active
    });
  });

  it("creates warning views for unavailable licenses", () => {
    expect(
      createStatusView({
        ...activeResponse,
        data: {
          ...activeResponse.data,
          available: false
        }
      })
    ).toEqual({
      level: "warning",
      message: DESKTOP_MESSAGES.invalid
    });
  });
});

describe("checkLicenseStatus", () => {
  it("calls GET /v1/licenses/status with saved license settings and domain", async () => {
    const calls: Array<{
      licenseKey: string;
      pluginId: string;
      kintoneDomain: string;
    }> = [];
    const dependencies: CheckLicenseStatusDependencies = {
      createClient: (config) => {
        expect(config).toEqual({
          apiBaseUrl: "https://api.example.com/v1",
          apiKey: "api-key"
        });

        return {
          async getStatus(query): Promise<LicenseStatusResponse> {
            calls.push(query);
            return activeResponse;
          }
        };
      }
    };

    await expect(
      checkLicenseStatus(
        {
          config: desktopConfig,
          kintoneDomain: "example.cybozu.com"
        },
        dependencies
      )
    ).resolves.toEqual({
      level: "info",
      message: DESKTOP_MESSAGES.active
    });
    expect(calls).toEqual([
      {
        licenseKey: "LIC-TEST-0001",
        pluginId: "plugin_001",
        kintoneDomain: "example.cybozu.com"
      }
    ]);
  });

  it("returns API error messages for license status failures", async () => {
    const dependencies: CheckLicenseStatusDependencies = {
      createClient: () => ({
        async getStatus(): Promise<LicenseStatusResponse> {
          throw new LicenseClientError(403, "License expired.");
        }
      })
    };

    await expect(
      checkLicenseStatus(
        {
          config: desktopConfig,
          kintoneDomain: "example.cybozu.com"
        },
        dependencies
      )
    ).resolves.toEqual({
      level: "error",
      message: "License expired."
    });
  });

  it("returns a generic communication error for unexpected failures", async () => {
    const dependencies: CheckLicenseStatusDependencies = {
      createClient: () => ({
        async getStatus(): Promise<LicenseStatusResponse> {
          throw new Error("network failed");
        }
      })
    };

    await expect(
      checkLicenseStatus(
        {
          config: desktopConfig,
          kintoneDomain: "example.cybozu.com"
        },
        dependencies
      )
    ).resolves.toEqual({
      level: "error",
      message: DESKTOP_MESSAGES.failed
    });
  });
});
