import type { LicenseAuthenticateRequest, LicenseAuthenticateResponse } from "@pluginadaptix/shared";

import { createLicenseClient, LicenseClientError, type LicenseClient } from "../api/license-client.js";

const PLUGIN_VERSION = "0.1.0";

export const CONFIG_ELEMENT_IDS = {
  apiBaseUrl: "plugin-adaptix-api-base-url",
  apiKey: "plugin-adaptix-api-key",
  pluginId: "plugin-adaptix-plugin-id",
  licenseKey: "plugin-adaptix-license-key",
  authenticateButton: "plugin-adaptix-authenticate",
  message: "plugin-adaptix-message"
} as const;

export const CONFIG_MESSAGES = {
  required: "Required settings are missing.",
  authenticating: "Authenticating license.",
  authenticated: "License authentication succeeded.",
  failed: "License authentication failed."
} as const;

interface ConfigFormElements {
  apiBaseUrl: HTMLInputElement;
  apiKey: HTMLInputElement;
  pluginId: HTMLInputElement;
  licenseKey: HTMLInputElement;
  authenticateButton: HTMLButtonElement;
  message: HTMLElement;
}

export interface ConfigValues {
  apiBaseUrl: string;
  apiKey: string;
  pluginId: string;
  licenseKey: string;
}

export interface AuthenticateConfigInput {
  values: ConfigValues;
  kintoneDomain: string;
  appId: string;
}

export interface AuthenticateConfigDependencies {
  createClient(config: { apiBaseUrl: string; apiKey: string }): Pick<LicenseClient, "authenticate">;
}

export interface AuthenticateConfigSuccess {
  success: true;
  config: Record<string, string>;
  response: LicenseAuthenticateResponse;
}

export interface AuthenticateConfigFailure {
  success: false;
  message: string;
}

export type AuthenticateConfigResult = AuthenticateConfigSuccess | AuthenticateConfigFailure;

export async function authenticateConfig(
  input: AuthenticateConfigInput,
  dependencies: AuthenticateConfigDependencies
): Promise<AuthenticateConfigResult> {
  try {
    const client = dependencies.createClient({
      apiBaseUrl: input.values.apiBaseUrl,
      apiKey: input.values.apiKey
    });
    const response = await client.authenticate(createAuthenticateRequest(input));

    return {
      success: true,
      config: createPersistedConfig(input.values),
      response
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof LicenseClientError ? error.message : CONFIG_MESSAGES.failed
    };
  }
}

export function validateConfigValues(values: Partial<ConfigValues>): ConfigValues | undefined {
  const apiBaseUrl = values.apiBaseUrl?.trim() ?? "";
  const apiKey = values.apiKey?.trim() ?? "";
  const pluginId = values.pluginId?.trim() ?? "";
  const licenseKey = values.licenseKey?.trim() ?? "";

  if (
    apiBaseUrl.length === 0 ||
    apiKey.length === 0 ||
    pluginId.length === 0 ||
    licenseKey.length === 0
  ) {
    return undefined;
  }

  return {
    apiBaseUrl,
    apiKey,
    pluginId,
    licenseKey
  };
}

export function createAuthenticateRequest(input: AuthenticateConfigInput): LicenseAuthenticateRequest {
  return {
    licenseKey: input.values.licenseKey,
    pluginId: input.values.pluginId,
    pluginVersion: PLUGIN_VERSION,
    kintoneDomain: input.kintoneDomain,
    appId: input.appId,
    environment: "production"
  };
}

function main(): void {
  const elements = getConfigFormElements();
  const config = kintone.plugin.app.getConfig(kintone.$PLUGIN_ID);

  restoreConfig(elements, config);
  elements.authenticateButton.addEventListener("click", () => {
    void handleAuthenticateClick(elements);
  });
}

function restoreConfig(elements: ConfigFormElements, config: KintonePluginConfig): void {
  const values = getInitialConfigValues(config);

  elements.apiBaseUrl.value = values.apiBaseUrl;
  elements.apiKey.value = values.apiKey;
  elements.pluginId.value = values.pluginId;
  elements.licenseKey.value = values.licenseKey;
}

async function handleAuthenticateClick(elements: ConfigFormElements): Promise<void> {
  const values = readFormValues(elements);

  if (values === undefined) {
    setMessage(elements, CONFIG_MESSAGES.required);
    return;
  }

  setMessage(elements, CONFIG_MESSAGES.authenticating);
  const result = await authenticateConfig(
    {
      values,
      kintoneDomain: window.location.hostname,
      appId: String(kintone.app.getId() ?? "")
    },
    {
      createClient: createLicenseClient
    }
  );

  if (!result.success) {
    setMessage(elements, result.message);
    return;
  }

  kintone.plugin.app.setConfig(result.config, () => {
    setMessage(elements, CONFIG_MESSAGES.authenticated);
  });
}

function readFormValues(elements: ConfigFormElements): ConfigValues | undefined {
  return validateConfigValues({
    apiBaseUrl: elements.apiBaseUrl.value,
    apiKey: elements.apiKey.value,
    pluginId: elements.pluginId.value,
    licenseKey: elements.licenseKey.value
  });
}

function createPersistedConfig(values: ConfigValues): Record<string, string> {
  return {
    apiBaseUrl: values.apiBaseUrl,
    apiKey: values.apiKey,
    pluginId: values.pluginId,
    licenseKey: values.licenseKey
  };
}

function getConfigFormElements(): ConfigFormElements {
  return {
    apiBaseUrl: getInputElement(CONFIG_ELEMENT_IDS.apiBaseUrl),
    apiKey: getInputElement(CONFIG_ELEMENT_IDS.apiKey),
    pluginId: getInputElement(CONFIG_ELEMENT_IDS.pluginId),
    licenseKey: getInputElement(CONFIG_ELEMENT_IDS.licenseKey),
    authenticateButton: getButtonElement(CONFIG_ELEMENT_IDS.authenticateButton),
    message: getElement(CONFIG_ELEMENT_IDS.message)
  };
}

function getInputElement(id: string): HTMLInputElement {
  const element = getElement(id);

  if (!(element instanceof HTMLInputElement)) {
    throw new Error(`${id} must be an input element.`);
  }

  return element;
}

function getButtonElement(id: string): HTMLButtonElement {
  const element = getElement(id);

  if (!(element instanceof HTMLButtonElement)) {
    throw new Error(`${id} must be a button element.`);
  }

  return element;
}

function getElement(id: string): HTMLElement {
  const element = document.getElementById(id);

  if (element === null) {
    throw new Error(`${id} was not found.`);
  }

  return element;
}

function setMessage(elements: ConfigFormElements, message: string): void {
  elements.message.textContent = message;
}

export function getInitialConfigValues(config: KintonePluginConfig): ConfigValues {
  return {
    apiBaseUrl: config.apiBaseUrl ?? "",
    apiKey: config.apiKey ?? "",
    pluginId: config.pluginId ?? "",
    licenseKey: config.licenseKey ?? ""
  };
}

if (typeof document !== "undefined" && typeof kintone !== "undefined") {
  main();
}
