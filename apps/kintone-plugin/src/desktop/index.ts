import type { LicenseStatusResponse } from "@pluginadaptix/shared";

import { createLicenseClient, LicenseClientError, type LicenseClient } from "../api/license-client.js";

const STATUS_ELEMENT_ID = "plugin-adaptix-license-status";

export const DESKTOP_MESSAGES = {
  notConfigured: "License settings are not configured. Open the plugin settings page.",
  active: "License is active.",
  invalid: "License is not valid. Open the plugin settings page.",
  failed: "License status check failed."
} as const;

export interface DesktopConfig {
  apiBaseUrl: string;
  apiKey: string;
  licenseKey: string;
  pluginId: string;
}

export interface CheckLicenseStatusInput {
  config: DesktopConfig;
  kintoneDomain: string;
}

export interface CheckLicenseStatusDependencies {
  createClient(config: { apiBaseUrl: string; apiKey: string }): Pick<LicenseClient, "getStatus">;
}

export interface LicenseStatusView {
  level: "info" | "warning" | "error";
  message: string;
}

function main(): void {
  const config = parseDesktopConfig(kintone.plugin.app.getConfig(kintone.$PLUGIN_ID));

  if (config === undefined) {
    renderStatus({
      level: "warning",
      message: DESKTOP_MESSAGES.notConfigured
    });
    return;
  }

  void checkLicenseStatus(
    {
      config,
      kintoneDomain: window.location.hostname
    },
    {
      createClient: createLicenseClient
    }
  ).then(renderStatus);
}

export async function checkLicenseStatus(
  input: CheckLicenseStatusInput,
  dependencies: CheckLicenseStatusDependencies
): Promise<LicenseStatusView> {
  const client = dependencies.createClient({
    apiBaseUrl: input.config.apiBaseUrl,
    apiKey: input.config.apiKey
  });

  try {
    const result = await client.getStatus({
      licenseKey: input.config.licenseKey,
      pluginId: input.config.pluginId,
      kintoneDomain: input.kintoneDomain
    });

    return createStatusView(result);
  } catch (error) {
    return {
      level: "error",
      message: error instanceof LicenseClientError ? error.message : DESKTOP_MESSAGES.failed
    };
  }
}

export function parseDesktopConfig(config: KintonePluginConfig): DesktopConfig | undefined {
  const apiBaseUrl = config.apiBaseUrl?.trim() ?? "";
  const apiKey = config.apiKey?.trim() ?? "";
  const licenseKey = config.licenseKey?.trim() ?? "";
  const pluginId = config.pluginId?.trim() ?? "";

  if (
    apiBaseUrl.length === 0 ||
    apiKey.length === 0 ||
    licenseKey.length === 0 ||
    pluginId.length === 0
  ) {
    return undefined;
  }

  return {
    apiBaseUrl,
    apiKey,
    licenseKey,
    pluginId
  };
}

export function createStatusView(response: LicenseStatusResponse): LicenseStatusView {
  if (response.data.available && isActiveStatus(response.data.licenseStatus)) {
    return {
      level: "info",
      message: DESKTOP_MESSAGES.active
    };
  }

  return {
    level: "warning",
    message: DESKTOP_MESSAGES.invalid
  };
}

function isActiveStatus(status: string): boolean {
  return ["active", "ACTIVE", "有効"].includes(status);
}

function renderStatus(view: LicenseStatusView): void {
  const headerSpace = document.querySelector(".gaia-argoui-app-toolbar-statusmenu");

  if (!(headerSpace instanceof HTMLElement)) {
    return;
  }

  let statusElement = document.getElementById(STATUS_ELEMENT_ID);

  if (statusElement === null) {
    statusElement = document.createElement("span");
    statusElement.id = STATUS_ELEMENT_ID;
    statusElement.style.marginLeft = "12px";
    statusElement.style.fontSize = "12px";
    statusElement.style.fontWeight = "700";
    headerSpace.append(statusElement);
  }

  statusElement.textContent = view.message;
  statusElement.style.color = getStatusColor(view.level);
}

function getStatusColor(level: LicenseStatusView["level"]): string {
  if (level === "info") {
    return "#047857";
  }

  if (level === "warning") {
    return "#b45309";
  }

  return "#b91c1c";
}

if (typeof document !== "undefined" && typeof kintone !== "undefined") {
  main();
}
