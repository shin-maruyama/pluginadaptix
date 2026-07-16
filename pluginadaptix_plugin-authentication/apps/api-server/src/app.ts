import express, { type Express } from "express";

import { createKintoneClient } from "./config/kintone.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { healthRoutes } from "./routes/health.routes.js";
import { createApiKeyMiddleware } from "./middlewares/api-key.middleware.js";
import { createLicenseRoutes } from "./routes/license.routes.js";
import { KintoneLicenseRepository, type LicenseRepository } from "./repositories/license.repository.js";
import { KintonePluginRepository, type PluginRepository } from "./repositories/plugin.repository.js";
import { createPluginRoutes } from "./routes/plugin.routes.js";
import type { Env } from "./config/env.js";

export interface CreateAppOptions {
  env?: Env;
  licenseRepository?: LicenseRepository;
  pluginRepository?: PluginRepository;
}

export function createApp(options: CreateAppOptions = {}): Express {
  const app = express();

  app.use(express.json());
  app.use("/v1/health", healthRoutes);

  if (options.env !== undefined) {
    const licenseRepository =
      options.licenseRepository ??
      new KintoneLicenseRepository(createKintoneClient(options.env), options.env.kintoneApps);
    const pluginRepository =
      options.pluginRepository ??
      new KintonePluginRepository(createKintoneClient(options.env), options.env.kintoneApps);
    app.use(
      "/v1/licenses",
      createApiKeyMiddleware(options.env.apiKey),
      createLicenseRoutes({ repository: licenseRepository })
    );
    app.use(
      "/v1/plugins",
      createApiKeyMiddleware(options.env.apiKey),
      createPluginRoutes({ repository: pluginRepository })
    );
  }

  app.use(errorMiddleware);

  return app;
}
