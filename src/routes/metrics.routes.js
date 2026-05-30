import express from "express";
import { getAdminMetrics, getStorageUsage } from "../controllers/metrics.controller.js";
import authMiddleware, { requireAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", authMiddleware, requireAdmin, getAdminMetrics);
router.get("/storage", authMiddleware, requireAdmin, getStorageUsage);

export default router;
