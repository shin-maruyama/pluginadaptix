import { describe, expect, it } from "vitest";

import { KINTONE_FIELD_CODES, KINTONE_TABLES } from "./kintone-fields.js";

describe("kintone field constants", () => {
  it("uses business keys as table identifiers", () => {
    expect(KINTONE_TABLES.LICENSES).toBe("licenses");
    expect(KINTONE_FIELD_CODES.licenses.licenseId).toBe("license_id");
    expect(KINTONE_FIELD_CODES.plugins.pluginId).toBe("plugin_id");
  });

  it("contains API lookup fields used by license authentication", () => {
    expect(KINTONE_FIELD_CODES.licenses.licenseKeyHash).toBe("license_key_hash");
    expect(KINTONE_FIELD_CODES.registeredDomains.kintoneDomain).toBe("kintone_domain");
    expect(KINTONE_FIELD_CODES.authLogs.resultStatus).toBe("result_status");
  });
});
