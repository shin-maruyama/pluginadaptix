import { describe, expect, it } from "vitest";

import { API_CODES, ERROR_CODES, SUCCESS_CODES } from "./error-codes.js";

describe("API code constants", () => {
  it("contains the required common error codes", () => {
    expect(ERROR_CODES.INVALID_REQUEST).toBe("INVALID_REQUEST");
    expect(ERROR_CODES.INVALID_API_KEY).toBe("INVALID_API_KEY");
    expect(ERROR_CODES.LICENSE_EXPIRED).toBe("LICENSE_EXPIRED");
    expect(ERROR_CODES.INTERNAL_SERVER_ERROR).toBe("INTERNAL_SERVER_ERROR");
  });

  it("contains OpenAPI success codes without changing error constants", () => {
    expect(SUCCESS_CODES.HEALTHY).toBe("HEALTHY");
    expect(API_CODES.LOG_CREATED).toBe("LOG_CREATED");
    expect(API_CODES.INVALID_LICENSE_KEY).toBe("INVALID_LICENSE_KEY");
  });
});
