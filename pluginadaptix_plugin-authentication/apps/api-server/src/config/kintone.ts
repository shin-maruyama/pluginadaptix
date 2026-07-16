import { KintoneClient } from "@pluginadaptix/kintone-client";

import type { Env } from "./env.js";

export function createKintoneClient(env: Env): KintoneClient {
  return new KintoneClient({
    baseUrl: env.kintoneBaseUrl,
    apiToken: env.kintoneApiToken
  });
}
