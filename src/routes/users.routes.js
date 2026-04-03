import express from "express";
import { getUsers, updateUserRole } from "../controllers/user.controller.js";
import authMiddleware, { requireAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", authMiddleware, requireAdmin, getUsers);
router.patch("/:id/role", authMiddleware, requireAdmin, updateUserRole);

export default router;
