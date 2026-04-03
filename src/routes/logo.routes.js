import express from "express";
import { createLogo, deleteLogo, getLogos } from "../controllers/logo.controller.js";
import authMiddleware, { requireAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getLogos);
router.post("/", authMiddleware, requireAdmin, createLogo);
router.delete("/:id", authMiddleware, requireAdmin, deleteLogo);

export default router;
