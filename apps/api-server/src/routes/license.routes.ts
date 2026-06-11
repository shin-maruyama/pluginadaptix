import { Router } from "express";

import {
  authenticateLicense,
  deactivateLicense,
  getLicenseStatus
} from "../controllers/license.controller.js";
import { LicenseService } from "../services/license.service.js";
import type { LicenseRepository } from "../repositories/license.repository.js";

export interface CreateLicenseRoutesOptions {
  repository: LicenseRepository;
}

export function createLicenseRoutes(options: CreateLicenseRoutesOptions): Router {
  const router = Router();
  const service = new LicenseService(options.repository);

  router.post("/authenticate", authenticateLicense(service));
  router.get("/status", getLicenseStatus(service));
  router.post("/deactivate", deactivateLicense(service));

  return router;
}
