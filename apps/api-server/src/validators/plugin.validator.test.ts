import { describe, expect, it } from "vitest";

import {
  validateDownloadTokenBody,
  validatePluginListQuery,
  validatePluginVersionQuery
} from "./plugin.validator.js";

describe("validatePluginVersionQuery", () => {
  it("accepts required query parameters", () => {
    expect(
      validatePluginVersionQuery({
        pluginId: "plugin_001",
        currentVersion: "1.0.0"
      })
    ).toEqual({
      success: true,
      data: {
        pluginId: "plugin_001",
        currentVersion: "1.0.0"
      }
    });
  });

  it("rejects missing query parameters", () => {
    expect(validatePluginVersionQuery({ pluginId: "plugin_001" })).toMatchObject({
      success: false,
      status: 400,
      response: {
        code: "INVALID_REQUEST"
      }
    });
  });
});

describe("validatePluginListQuery", () => {
  it("accepts memberId", () => {
    expect(validatePluginListQuery({ memberId: "mem_001" })).toEqual({
      success: true,
      data: {
        memberId: "mem_001"
      }
    });
  });

  it("rejects missing memberId", () => {
    expect(validatePluginListQuery({})).toMatchObject({
      success: false,
      status: 400,
      response: {
        code: "INVALID_REQUEST"
      }
    });
  });
});

describe("validateDownloadTokenBody", () => {
  it("accepts required body fields", () => {
    expect(
      validateDownloadTokenBody({
        memberId: "mem_001",
        pluginId: "plugin_001",
        licenseKey: "LIC-TEST-0001"
      })
    ).toEqual({
      success: true,
      data: {
        memberId: "mem_001",
        pluginId: "plugin_001",
        licenseKey: "LIC-TEST-0001"
      }
    });
  });

  it("rejects missing licenseKey", () => {
    expect(
      validateDownloadTokenBody({
        memberId: "mem_001",
        pluginId: "plugin_001"
      })
    ).toMatchObject({
      success: false,
      status: 400,
      response: {
        code: "INVALID_REQUEST"
      }
    });
  });
});
