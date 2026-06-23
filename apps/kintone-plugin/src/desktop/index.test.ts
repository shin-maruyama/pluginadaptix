import type { LicenseStatusResponse, PluginVersionResponse } from "@pluginadaptix/shared";
import { describe, expect, it } from "vitest";

import { LicenseClientError } from "../api/license-client.js";
import {
  checkLicenseStatus,
  checkPluginVersion,
  createPluginVersionView,
  createStatusView,
  DESKTOP_MESSAGES,
  parseDesktopConfig,
  type CheckPluginVersionDependencies,
  type CheckLicenseStatusDependencies,
  type DesktopConfig
} from "./index.js";

const desktopConfig: DesktopConfig = {
  apiBaseUrl: "https://api.example.com/v1",
  apiKey: "api-key",
  licenseKey: "LIC-TEST-0001",
  pluginId: "plugin_001",
  kintoneDomain: "saved.cybozu.com"
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

const updateResponse: PluginVersionResponse = {
  success: true,
  code: "VERSION_CHECKED",
  message: "ok",
  data: {
    pluginId: "plugin_001",
    currentVersion: "0.1.0",
    latestVersion: "0.2.0",
    updateRequired: true,
    forceUpdate: false,
    releaseNote: "Bug fixes."
  }
};

describe("parseDesktopConfig", () => {
  it("reads saved license settings", () => {
    expect(
      parseDesktopConfig({
        apiBaseUrl: " https://api.example.com/v1 ",
        apiKey: " api-key ",
        licenseKey: " LIC-TEST-0001 ",
        pluginId: " plugin_001 ",
        kintoneDomain: " saved.cybozu.com "
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

describe("createPluginVersionView", () => {
  it("does not create notifications when the plugin is current", () => {
    expect(
      createPluginVersionView({
        ...updateResponse,
        data: {
          ...updateResponse.data,
          latestVersion: "0.1.0",
          updateRequired: false
        }
      })
    ).toBeUndefined();
  });

  it("creates update notifications with release notes", () => {
    expect(createPluginVersionView(updateResponse)).toEqual({
      level: "warning",
      message:
        "Plugin update is available. Current: 0.1.0, Latest: 0.2.0. Release notes: Bug fixes."
    });
  });

  it("creates force update warnings with release notes", () => {
    expect(
      createPluginVersionView({
        ...updateResponse,
        data: {
          ...updateResponse.data,
          forceUpdate: true,
          releaseNote: "Security update."
        }
      })
    ).toEqual({
      level: "error",
      message:
        "Plugin update is required. Current: 0.1.0, Latest: 0.2.0. Release notes: Security update."
    });
  });
});

describe("checkLicenseStatus", () => {
  it("calls GET /v1/licenses/status with saved license settings and kintone domain", async () => {
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
          config: desktopConfig
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
        kintoneDomain: "saved.cybozu.com"
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
          config: desktopConfig
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
          config: desktopConfig
        },
        dependencies
      )
    ).resolves.toEqual({
      level: "error",
      message: DESKTOP_MESSAGES.failed
    });
  });
});

describe("checkPluginVersion", () => {
  it("calls GET /v1/plugins/version with the saved plugin ID and current version", async () => {
    const calls: Array<{
      pluginId: string;
      currentVersion: string;
    }> = [];
    const dependencies: CheckPluginVersionDependencies = {
      createClient: (config) => {
        expect(config).toEqual({
          apiBaseUrl: "https://api.example.com/v1",
          apiKey: "api-key"
        });

        return {
          async getPluginVersion(query): Promise<PluginVersionResponse> {
            calls.push(query);
            return updateResponse;
          }
        };
      }
    };

    await expect(
      checkPluginVersion(
        {
          config: desktopConfig
        },
        dependencies
      )
    ).resolves.toEqual({
      level: "warning",
      message:
        "Plugin update is available. Current: 0.1.0, Latest: 0.2.0. Release notes: Bug fixes."
    });
    expect(calls).toEqual([
      {
        pluginId: "plugin_001",
        currentVersion: "0.1.0"
      }
    ]);
  });

  it("returns API error messages for plugin version check failures", async () => {
    const dependencies: CheckPluginVersionDependencies = {
      createClient: () => ({
        async getPluginVersion(): Promise<PluginVersionResponse> {
          throw new LicenseClientError(500, "Version service failed.");
        }
      })
    };

    await expect(
      checkPluginVersion(
        {
          config: desktopConfig
        },
        dependencies
      )
    ).resolves.toEqual({
      level: "error",
      message: "Version service failed."
    });
  });

  it("returns a generic communication error for unexpected version check failures", async () => {
    const dependencies: CheckPluginVersionDependencies = {
      createClient: () => ({
        async getPluginVersion(): Promise<PluginVersionResponse> {
          throw new Error("network failed");
        }
      })
    };

    await expect(
      checkPluginVersion(
        {
          config: desktopConfig
        },
        dependencies
      )
    ).resolves.toEqual({
      level: "error",
      message: DESKTOP_MESSAGES.versionCheckFailed
    });
  });
});
