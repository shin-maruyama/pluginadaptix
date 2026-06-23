import type { LicenseStatusResponse, PluginVersionResponse } from "@pluginadaptix/shared";

import { createLicenseClient, LicenseClientError, type LicenseClient } from "../api/license-client.js";

const PLUGIN_VERSION = "0.1.0";
const STATUS_ELEMENT_ID = "plugin-adaptix-license-status";
const VERSION_ELEMENT_ID = "plugin-adaptix-version-status";

export const DESKTOP_MESSAGES = {
  notConfigured: "License settings are not configured. Open the plugin settings page.",
  active: "License is active.",
  invalid: "License is not valid. Open the plugin settings page.",
  failed: "License status check failed.",
  updateAvailable: "Plugin update is available.",
  forceUpdate: "Plugin update is required.",
  versionCheckFailed: "Plugin version check failed."
} as const;

export interface DesktopConfig {
  apiBaseUrl: string;
  apiKey: string;
  licenseKey: string;
  pluginId: string;
  kintoneDomain: string;
}

export interface CheckLicenseStatusInput {
  config: DesktopConfig;
}

export interface CheckLicenseStatusDependencies {
  createClient(config: { apiBaseUrl: string; apiKey: string }): Pick<LicenseClient, "getStatus">;
}

export interface CheckPluginVersionInput {
  config: DesktopConfig;
}

export interface CheckPluginVersionDependencies {
  createClient(config: { apiBaseUrl: string; apiKey: string }): Pick<
    LicenseClient,
    "getPluginVersion"
  >;
}

export interface DesktopNoticeView {
  level: "info" | "warning" | "error";
  message: string;
}

export type LicenseStatusView = DesktopNoticeView;
export type PluginVersionView = DesktopNoticeView | undefined;

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
      config
    },
    {
      createClient: createLicenseClient
    }
  ).then(renderStatus);

  void checkPluginVersion(
    {
      config
    },
    {
      createClient: createLicenseClient
    }
  ).then(renderVersion);
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
      kintoneDomain: input.config.kintoneDomain
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
  const kintoneDomain = config.kintoneDomain?.trim() ?? "";

  if (
    apiBaseUrl.length === 0 ||
    apiKey.length === 0 ||
    licenseKey.length === 0 ||
    pluginId.length === 0 ||
    kintoneDomain.length === 0
  ) {
    return undefined;
  }

  return {
    apiBaseUrl,
    apiKey,
    licenseKey,
    pluginId,
    kintoneDomain
  };
}

export async function checkPluginVersion(
  input: CheckPluginVersionInput,
  dependencies: CheckPluginVersionDependencies
): Promise<PluginVersionView> {
  const client = dependencies.createClient({
    apiBaseUrl: input.config.apiBaseUrl,
    apiKey: input.config.apiKey
  });

  try {
    const result = await client.getPluginVersion({
      pluginId: input.config.pluginId,
      currentVersion: PLUGIN_VERSION
    });

    return createPluginVersionView(result);
  } catch (error) {
    return {
      level: "error",
      message: error instanceof LicenseClientError ? error.message : DESKTOP_MESSAGES.versionCheckFailed
    };
  }
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

export function createPluginVersionView(response: PluginVersionResponse): PluginVersionView {
  if (!response.data.updateRequired) {
    return undefined;
  }

  const message = createPluginVersionMessage(response);

  return {
    level: response.data.forceUpdate ? "error" : "warning",
    message
  };
}

function createPluginVersionMessage(response: PluginVersionResponse): string {
  const baseMessage = response.data.forceUpdate
    ? DESKTOP_MESSAGES.forceUpdate
    : DESKTOP_MESSAGES.updateAvailable;
  const versionMessage = `Current: ${response.data.currentVersion}, Latest: ${response.data.latestVersion}.`;
  const releaseNote = response.data.releaseNote?.trim();

  if (releaseNote === undefined || releaseNote.length === 0) {
    return `${baseMessage} ${versionMessage}`;
  }

  return `${baseMessage} ${versionMessage} Release notes: ${releaseNote}`;
}

function isActiveStatus(status: string): boolean {
  return ["active", "ACTIVE", "有効"].includes(status);
}

function renderStatus(view: LicenseStatusView): void {
  renderNotice(STATUS_ELEMENT_ID, view);
}

function renderVersion(view: PluginVersionView): void {
  if (view === undefined) {
    return;
  }

  renderNotice(VERSION_ELEMENT_ID, view);
}

function renderNotice(elementId: string, view: DesktopNoticeView): void {
  const headerSpace = document.querySelector(".gaia-argoui-app-toolbar-statusmenu");

  if (!(headerSpace instanceof HTMLElement)) {
    return;
  }

  let statusElement = document.getElementById(elementId);

  if (statusElement === null) {
    statusElement = document.createElement("span");
    statusElement.id = elementId;
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
