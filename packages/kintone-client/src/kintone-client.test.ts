import { describe, expect, it, vi } from "vitest";

import { createKintoneClientFromEnv, KintoneClient, KintoneClientError } from "./kintone-client.js";
import type { KintoneRecord } from "./types.js";

interface FetchCall {
  input: Parameters<typeof fetch>[0];
  init: Parameters<typeof fetch>[1];
}

type FetchMock = typeof fetch & {
  calls: FetchCall[];
};

function createJsonResponse(body: unknown, init?: ResponseInit): Response {
  return new Response(JSON.stringify(body), {
    headers: {
      "Content-Type": "application/json"
    },
    status: 200,
    ...init
  });
}

function createFetchMock(response: Response): FetchMock {
  const calls: FetchCall[] = [];
  const fetchMock: typeof fetch = (input, init) => {
    calls.push({ input, init });
    return Promise.resolve(response);
  };

  return Object.assign(fetchMock, { calls });
}

function getFirstFetchCall(fetchMock: FetchMock): FetchCall {
  const firstCall = fetchMock.calls[0];

  if (firstCall === undefined) {
    throw new Error("fetch was not called.");
  }

  return firstCall;
}

describe("KintoneClient", () => {
  it("creates a client from environment variables", async () => {
    const response = createJsonResponse({ records: [] });
    const fetchMock = createFetchMock(response);
    const client = new KintoneClient({
      baseUrl: "https://example.cybozu.com/",
      apiToken: "token",
      fetch: fetchMock
    });

    await expect(client.getRecords({ app: 100 })).resolves.toEqual({ records: [] });

    const { input, init } = getFirstFetchCall(fetchMock);
    expect(String(input)).toBe("https://example.cybozu.com/k/v1/records.json?app=100");
    expect(init?.headers).toEqual({
      "Content-Type": "application/json",
      "X-Cybozu-API-Token": "token"
    });
  });

  it("requires kintone environment variables", () => {
    expect(() => createKintoneClientFromEnv({ KINTONE_API_TOKEN: "token" })).toThrow(
      "KINTONE_BASE_URL is required."
    );
    expect(() => createKintoneClientFromEnv({ KINTONE_BASE_URL: "https://example.cybozu.com" }))
      .toThrow("KINTONE_API_TOKEN is required.");
  });

  it("gets records with query, fields, and totalCount", async () => {
    const records: KintoneRecord[] = [{ customer_id: { value: "CUS-000001" } }];
    const fetchMock = createFetchMock(createJsonResponse({ records, totalCount: "1" }));
    const client = new KintoneClient({
      baseUrl: "https://example.cybozu.com",
      apiToken: "token",
      fetch: fetchMock
    });

    const result = await client.getRecords({
      app: 100,
      query: "customer_id = \"CUS-000001\"",
      fields: ["customer_id", "company_name"],
      totalCount: true
    });

    const { input } = getFirstFetchCall(fetchMock);
    const requestUrl = new URL(String(input));
    expect(requestUrl.pathname).toBe("/k/v1/records.json");
    expect(requestUrl.searchParams.get("app")).toBe("100");
    expect(requestUrl.searchParams.get("query")).toBe("customer_id = \"CUS-000001\"");
    expect(requestUrl.searchParams.getAll("fields[]")).toEqual(["customer_id", "company_name"]);
    expect(requestUrl.searchParams.get("totalCount")).toBe("true");
    expect(result).toEqual({ records, totalCount: "1" });
  });

  it("gets a single record by kintone record id", async () => {
    const record: KintoneRecord = { license_id: { value: "LIC-000001" } };
    const fetchMock = createFetchMock(createJsonResponse({ record }));
    const client = new KintoneClient({
      baseUrl: "https://example.cybozu.com",
      apiToken: "token",
      fetch: fetchMock
    });

    await expect(client.getRecord({ app: "102", id: "10" })).resolves.toEqual({ record });

    const { input } = getFirstFetchCall(fetchMock);
    expect(String(input)).toBe("https://example.cybozu.com/k/v1/record.json?app=102&id=10");
  });

  it("adds a record", async () => {
    const fetchMock = createFetchMock(createJsonResponse({ id: "20", revision: "1" }));
    const client = new KintoneClient({
      baseUrl: "https://example.cybozu.com",
      apiToken: "token",
      fetch: fetchMock
    });

    await expect(
      client.addRecord({
        app: 105,
        record: {
          log_id: { value: "LOG-000001" },
          result_status: { value: "success" }
        }
      })
    ).resolves.toEqual({ id: "20", revision: "1" });

    const { init } = getFirstFetchCall(fetchMock);
    expect(init?.method).toBe("POST");
    expect(init?.body).toBe(
      JSON.stringify({
        app: 105,
        record: {
          log_id: { value: "LOG-000001" },
          result_status: { value: "success" }
        }
      })
    );
  });

  it("updates a record by business key with updateKey", async () => {
    const fetchMock = createFetchMock(createJsonResponse({ revision: "2" }));
    const client = new KintoneClient({
      baseUrl: "https://example.cybozu.com",
      apiToken: "token",
      fetch: fetchMock
    });

    await expect(
      client.updateRecord({
        app: 102,
        updateKey: {
          field: "license_id",
          value: "LIC-000001"
        },
        record: {
          license_status: { value: "active" }
        }
      })
    ).resolves.toEqual({ revision: "2" });

    const { init } = getFirstFetchCall(fetchMock);
    expect(init?.method).toBe("PUT");
    expect(init?.body).toBe(
      JSON.stringify({
        app: 102,
        updateKey: {
          field: "license_id",
          value: "LIC-000001"
        },
        record: {
          license_status: { value: "active" }
        }
      })
    );
  });

  it("rejects update requests without id or updateKey", async () => {
    const fetchMock = createFetchMock(createJsonResponse({ revision: "2" }));
    const client = new KintoneClient({
      baseUrl: "https://example.cybozu.com",
      apiToken: "token",
      fetch: fetchMock
    });

    await expect(
      client.updateRecord({
        app: 102,
        record: {
          license_status: { value: "active" }
        }
      })
    ).rejects.toThrow("Either id or updateKey is required to update a kintone record.");
  });

  it("throws a typed error for kintone API failures", async () => {
    const responseBody = { code: "GAIA_RE01", message: "Record not found." };
    const fetchMock = createFetchMock(createJsonResponse(responseBody, { status: 404 }));
    const client = new KintoneClient({
      baseUrl: "https://example.cybozu.com",
      apiToken: "token",
      fetch: fetchMock
    });

    await expect(client.getRecord({ app: 100, id: 999 })).rejects.toMatchObject({
      status: 404,
      responseBody
    } satisfies Partial<KintoneClientError>);
  });
});
