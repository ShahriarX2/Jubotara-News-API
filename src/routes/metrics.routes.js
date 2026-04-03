import express from "express";
import { getAdminMetrics } from "../controllers/metrics.controller.js";
import authMiddleware, { requireAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", authMiddleware, requireAdmin, getAdminMetrics);

export default router;
