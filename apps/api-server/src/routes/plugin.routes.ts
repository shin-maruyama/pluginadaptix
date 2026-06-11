import { Router } from "express";

import { createDownloadToken, getPluginVersion, listPlugins } from "../controllers/plugin.controller.js";
import type { PluginRepository } from "../repositories/plugin.repository.js";
import { PluginService } from "../services/plugin.service.js";

export interface CreatePluginRoutesOptions {
  repository: PluginRepository;
}

export function createPluginRoutes(options: CreatePluginRoutesOptions): Router {
  const router = Router();
  const service = new PluginService(options.repository);

  router.get("/version", getPluginVersion(service));
  router.post("/download-token", createDownloadToken(service));
  router.get("/", listPlugins(service));

  return router;
}
