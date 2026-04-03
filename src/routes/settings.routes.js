import express from "express";
import { getSettings, upsertSetting } from "../controllers/settings.controller.js";
import authMiddleware, { requireAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getSettings);
router.post("/", authMiddleware, requireAdmin, upsertSetting);

export default router;
