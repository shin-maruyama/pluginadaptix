import { describe, expect, it } from "vitest";

import {
  validateLicenseAuthenticateRequest,
  validateLicenseDeactivateRequest,
  validateLicenseStatusQuery
} from "./license.validator.js";

describe("validateLicenseAuthenticateRequest", () => {
  it("accepts OpenAPI compatible request bodies", () => {
    expect(
      validateLicenseAuthenticateRequest({
        licenseKey: "LIC-AAAA-BBBB-1234",
        pluginId: "plugin_001",
        pluginVersion: "1.0.0",
        kintoneDomain: "sample.cybozu.com",
        companyName: "Sample",
        appId: "123",
        environment: "sandbox"
      })
    ).toEqual({
      success: true,
      data: {
        licenseKey: "LIC-AAAA-BBBB-1234",
        pluginId: "plugin_001",
        pluginVersion: "1.0.0",
        kintoneDomain: "sample.cybozu.com",
        companyName: "Sample",
        appId: "123",
        environment: "sandbox"
      }
    });
  });

  it("rejects missing required fields", () => {
    expect(validateLicenseAuthenticateRequest({ pluginId: "plugin_001" })).toMatchObject({
      success: false,
      status: 400,
      response: {
        code: "INVALID_REQUEST"
      }
    });
  });
});

describe("validateLicenseStatusQuery", () => {
  it("accepts required status query parameters", () => {
    expect(
      validateLicenseStatusQuery({
        licenseKey: "LIC-AAAA-BBBB-1234",
        pluginId: "plugin_001",
        kintoneDomain: "sample.cybozu.com"
      })
    ).toEqual({
      success: true,
      data: {
        licenseKey: "LIC-AAAA-BBBB-1234",
        pluginId: "plugin_001",
        kintoneDomain: "sample.cybozu.com"
      }
    });
  });

  it("rejects missing status query parameters", () => {
    expect(validateLicenseStatusQuery({ licenseKey: "LIC-AAAA-BBBB-1234" })).toMatchObject({
      success: false,
      status: 400,
      response: {
        code: "INVALID_REQUEST"
      }
    });
  });
});

describe("validateLicenseDeactivateRequest", () => {
  it("accepts OpenAPI compatible deactivate request bodies", () => {
    expect(
      validateLicenseDeactivateRequest({
        licenseKey: "LIC-AAAA-BBBB-1234",
        pluginId: "plugin_001",
        kintoneDomain: "sample.cybozu.com",
        reason: "user_deactivated"
      })
    ).toEqual({
      success: true,
      data: {
        licenseKey: "LIC-AAAA-BBBB-1234",
        pluginId: "plugin_001",
        kintoneDomain: "sample.cybozu.com",
        reason: "user_deactivated"
      }
    });
  });

  it("rejects missing deactivate request fields", () => {
    expect(validateLicenseDeactivateRequest({ licenseKey: "LIC-AAAA-BBBB-1234" })).toMatchObject({
      success: false,
      status: 400,
      response: {
        code: "INVALID_REQUEST"
      }
    });
  });
});
