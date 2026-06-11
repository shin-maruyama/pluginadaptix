import { describe, expectTypeOf, it } from "vitest";

import type {
  ApiResponse,
  AuthLogRequest,
  LicenseAuthenticateRequest,
  LicenseAuthenticateResponse
} from "./api.js";

describe("API shared types", () => {
  it("types common API responses", () => {
    expectTypeOf<ApiResponse<{ status: string }>>().toMatchTypeOf<{
      success: boolean;
      code: string;
      message: string;
      data?: { status: string };
    }>();
  });

  it("types license authentication DTOs", () => {
    expectTypeOf<LicenseAuthenticateRequest>().toMatchTypeOf<{
      licenseKey: string;
      pluginId: string;
      pluginVersion: string;
      kintoneDomain: string;
    }>();

    expectTypeOf<LicenseAuthenticateResponse["data"]>().toEqualTypeOf<{
      licenseId: string;
      licenseStatus: string;
      contractStatus: string;
      pluginId: string;
      pluginName: string;
      expireDate: string;
      registeredDomain: string;
      maxDomains: number;
      currentDomains: number;
    }>();
  });

  it("restricts OpenAPI enum fields", () => {
    expectTypeOf<AuthLogRequest["eventType"]>().toEqualTypeOf<
      "authenticate" | "status" | "deactivate" | "download" | "error"
    >();
    expectTypeOf<AuthLogRequest["result"]>().toEqualTypeOf<"success" | "failure" | "warning">();
  });
});
