import type {
  ErrorResponse,
  LicenseAuthenticateRequest,
  LicenseAuthenticateResponse,
  LicenseStatusQuery,
  LicenseStatusResponse,
  PluginVersionQuery,
  PluginVersionResponse
} from "@pluginadaptix/shared";

export interface LicenseClientConfig {
  apiBaseUrl: string;
  apiKey: string;
}

export interface LicenseClient {
  authenticate(request: LicenseAuthenticateRequest): Promise<LicenseAuthenticateResponse>;
  getStatus(query: LicenseStatusQuery): Promise<LicenseStatusResponse>;
  getPluginVersion(query: PluginVersionQuery): Promise<PluginVersionResponse>;
}

export type LicenseClientFetch = (
  input: string,
  init: {
    method: "GET" | "POST";
    headers: Record<string, string>;
    body?: string;
  }
) => Promise<LicenseClientFetchResponse>;

export interface LicenseClientFetchResponse {
  ok: boolean;
  status: number;
  json(): Promise<unknown>;
}

export class LicenseClientError extends Error {
  public readonly status: number;
  public readonly response: ErrorResponse | undefined;

  public constructor(status: number, message: string, response?: ErrorResponse) {
    super(message);
    this.name = "LicenseClientError";
    this.status = status;
    this.response = response;
  }
}

export function createLicenseClient(
  config: LicenseClientConfig,
  fetcher: LicenseClientFetch = window.fetch.bind(window) as LicenseClientFetch
): LicenseClient {
  const baseUrl = normalizeBaseUrl(config.apiBaseUrl);

  return {
    async authenticate(request: LicenseAuthenticateRequest): Promise<LicenseAuthenticateResponse> {
      const response = await fetcher(`${baseUrl}/licenses/authenticate`, {
        method: "POST",
        headers: createHeaders(config.apiKey),
        body: JSON.stringify(request)
      });

      return parseSuccessResponse<LicenseAuthenticateResponse>(response);
    },

    async getStatus(query: LicenseStatusQuery): Promise<LicenseStatusResponse> {
      const url = new URL(`${baseUrl}/licenses/status`);
      url.searchParams.set("licenseKey", query.licenseKey);
      url.searchParams.set("pluginId", query.pluginId);
      url.searchParams.set("kintoneDomain", query.kintoneDomain);

      const response = await fetcher(url.toString(), {
        method: "GET",
        headers: createHeaders(config.apiKey)
      });

      return parseSuccessResponse<LicenseStatusResponse>(response);
    },

    async getPluginVersion(query: PluginVersionQuery): Promise<PluginVersionResponse> {
      const url = new URL(`${baseUrl}/plugins/version`);
      url.searchParams.set("pluginId", query.pluginId);
      url.searchParams.set("currentVersion", query.currentVersion);

      const response = await fetcher(url.toString(), {
        method: "GET",
        headers: createHeaders(config.apiKey)
      });

      return parseSuccessResponse<PluginVersionResponse>(response);
    }
  };
}

export function normalizeBaseUrl(value: string): string {
  return value.trim().replace(/\/+$/, "");
}

async function parseSuccessResponse<TResponse>(
  response: LicenseClientFetchResponse
): Promise<TResponse> {
  const payload = await response.json();

  if (!isResponseObject(payload)) {
    throw new LicenseClientError(response.status, "API response was invalid.");
  }

  if (!response.ok || payload.success !== true) {
    throw new LicenseClientError(
      response.status,
      typeof payload.message === "string" ? payload.message : "API request failed.",
      isErrorResponse(payload) ? payload : undefined
    );
  }

  return payload as TResponse;
}

function createHeaders(apiKey: string): Record<string, string> {
  return {
    "Content-Type": "application/json",
    "X-API-Key": apiKey
  };
}

function isResponseObject(value: unknown): value is { success?: unknown; message?: unknown } {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isErrorResponse(value: unknown): value is ErrorResponse {
  if (!isResponseObject(value)) {
    return false;
  }

  const code = "code" in value ? value.code : undefined;
  const message = "message" in value ? value.message : undefined;

  return value.success === false && typeof code === "string" && typeof message === "string";
}
