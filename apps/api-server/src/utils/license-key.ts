import { createHash } from "node:crypto";

export function createLicenseKeyHash(licenseKey: string): string {
  return createHash("sha256").update(licenseKey).digest("hex");
}

export function maskLicenseKey(licenseKey: string): string {
  const parts = licenseKey.split("-");
  const lastPart = parts.at(-1);

  if (parts.length >= 2 && lastPart !== undefined) {
    return `LIC-****-****-${lastPart}`;
  }

  return `****${licenseKey.slice(-4)}`;
}
