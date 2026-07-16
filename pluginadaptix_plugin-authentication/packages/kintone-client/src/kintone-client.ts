import type {
  AddRecordParams,
  AddRecordResponse,
  GetRecordParams,
  GetRecordResponse,
  GetRecordsParams,
  GetRecordsResponse,
  KintoneClientOptions,
  KintoneRecord,
  KintoneRecordInput,
  UpdateRecordParams,
  UpdateRecordResponse
} from "./types.js";

const DEFAULT_BASE_PATH = "/k/v1";

export class KintoneClientError extends Error {
  public readonly status: number;
  public readonly responseBody: unknown;

  public constructor(message: string, status: number, responseBody: unknown) {
    super(message);
    this.name = "KintoneClientError";
    this.status = status;
    this.responseBody = responseBody;
  }
}

export class KintoneClient {
  private readonly baseUrl: string;
  private readonly apiToken: string;
  private readonly fetchImpl: typeof fetch;

  public constructor(options: KintoneClientOptions) {
    this.baseUrl = normalizeBaseUrl(options.baseUrl);
    this.apiToken = requireNonEmpty("apiToken", options.apiToken);
    this.fetchImpl = options.fetch ?? fetch;
  }

  public async getRecords<TRecord extends KintoneRecord = KintoneRecord>(
    params: GetRecordsParams
  ): Promise<GetRecordsResponse<TRecord>> {
    const searchParams = new URLSearchParams();
    searchParams.set("app", String(params.app));

    if (params.query !== undefined) {
      searchParams.set("query", params.query);
    }

    if (params.totalCount !== undefined) {
      searchParams.set("totalCount", String(params.totalCount));
    }

    params.fields?.forEach((field) => {
      searchParams.append("fields[]", field);
    });

    return this.request<GetRecordsResponse<TRecord>>(
      "GET",
      `${DEFAULT_BASE_PATH}/records.json?${searchParams.toString()}`
    );
  }

  public async getRecord<TRecord extends KintoneRecord = KintoneRecord>(
    params: GetRecordParams
  ): Promise<GetRecordResponse<TRecord>> {
    const searchParams = new URLSearchParams({
      app: String(params.app),
      id: String(params.id)
    });

    return this.request<GetRecordResponse<TRecord>>(
      "GET",
      `${DEFAULT_BASE_PATH}/record.json?${searchParams.toString()}`
    );
  }

  public async addRecord<TRecord extends KintoneRecordInput = KintoneRecordInput>(
    params: AddRecordParams<TRecord>
  ): Promise<AddRecordResponse> {
    return this.request<AddRecordResponse>("POST", `${DEFAULT_BASE_PATH}/record.json`, {
      app: params.app,
      record: params.record
    });
  }

  public async updateRecord<TRecord extends KintoneRecordInput = KintoneRecordInput>(
    params: UpdateRecordParams<TRecord>
  ): Promise<UpdateRecordResponse> {
    if (params.id === undefined && params.updateKey === undefined) {
      throw new Error("Either id or updateKey is required to update a kintone record.");
    }

    return this.request<UpdateRecordResponse>("PUT", `${DEFAULT_BASE_PATH}/record.json`, {
      app: params.app,
      id: params.id,
      updateKey: params.updateKey,
      revision: params.revision,
      record: params.record
    });
  }

  private async request<TResponse>(
    method: "GET" | "POST" | "PUT",
    path: string,
    body?: Record<string, unknown>
  ): Promise<TResponse> {
    const requestInit: RequestInit = {
      method,
      headers: this.createHeaders()
    };

    if (body !== undefined) {
      requestInit.body = JSON.stringify(stripUndefined(body));
    }

    const response = await this.fetchImpl(`${this.baseUrl}${path}`, requestInit);
    const responseBody = await parseResponseBody(response);

    if (!response.ok) {
      throw new KintoneClientError("kintone REST API request failed.", response.status, responseBody);
    }

    return responseBody as TResponse;
  }

  private createHeaders(): Record<string, string> {
    return {
      "Content-Type": "application/json",
      "X-Cybozu-API-Token": this.apiToken
    };
  }
}

export function createKintoneClientFromEnv(env: NodeJS.ProcessEnv = process.env): KintoneClient {
  return new KintoneClient({
    baseUrl: requireEnv(env, "KINTONE_BASE_URL"),
    apiToken: requireEnv(env, "KINTONE_API_TOKEN")
  });
}

function normalizeBaseUrl(baseUrl: string): string {
  return requireNonEmpty("baseUrl", baseUrl).replace(/\/+$/, "");
}

function requireNonEmpty(name: string, value: string): string {
  const trimmedValue = value.trim();

  if (trimmedValue.length === 0) {
    throw new Error(`${name} is required.`);
  }

  return trimmedValue;
}

function requireEnv(env: NodeJS.ProcessEnv, name: string): string {
  const value = env[name];

  if (value === undefined || value.trim().length === 0) {
    throw new Error(`${name} is required.`);
  }

  return value;
}

function stripUndefined(source: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(Object.entries(source).filter(([, value]) => value !== undefined));
}

async function parseResponseBody(response: Response): Promise<unknown> {
  const text = await response.text();

  if (text.length === 0) {
    return null;
  }

  return JSON.parse(text) as unknown;
}
