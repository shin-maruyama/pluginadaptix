export interface Env {
  port: number;
  apiKey: string;
  kintoneBaseUrl: string;
  kintoneApiToken: string;
  kintoneApps: KintoneAppEnv;
}

export interface KintoneAppEnv {
  customers: string;
  contracts: string;
  licenses: string;
  plugins: string;
  pluginVersions: string;
  registeredDomains: string;
  authLogs: string;
  downloadLogs: string;
}

export function loadEnv(source: NodeJS.ProcessEnv = process.env): Env {
  return {
    port: parsePort(source.PORT),
    apiKey: readOptionalEnv(source, "API_KEY"),
    kintoneBaseUrl: readOptionalEnv(source, "KINTONE_BASE_URL"),
    kintoneApiToken: readOptionalEnv(source, "KINTONE_API_TOKEN"),
    kintoneApps: {
      customers: readOptionalEnv(source, "KINTONE_APP_CUSTOMERS"),
      contracts: readOptionalEnv(source, "KINTONE_APP_CONTRACTS"),
      licenses: readOptionalEnv(source, "KINTONE_APP_LICENSES"),
      plugins: readOptionalEnv(source, "KINTONE_APP_PLUGINS"),
      pluginVersions: readOptionalEnv(source, "KINTONE_APP_PLUGIN_VERSIONS"),
      registeredDomains: readOptionalEnv(source, "KINTONE_APP_REGISTERED_DOMAINS"),
      authLogs: readOptionalEnv(source, "KINTONE_APP_AUTH_LOGS"),
      downloadLogs: readOptionalEnv(source, "KINTONE_APP_DOWNLOAD_LOGS")
    }
  };
}

function parsePort(value: string | undefined): number {
  if (value === undefined || value.trim().length === 0) {
    return 3000;
  }

  const port = Number(value);

  if (!Number.isInteger(port) || port <= 0 || port > 65535) {
    throw new Error("PORT must be an integer between 1 and 65535.");
  }

  return port;
}

function readOptionalEnv(source: NodeJS.ProcessEnv, name: string): string {
  return source[name]?.trim() ?? "";
}
