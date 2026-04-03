import express from "express";
import {
    createMember,
    deleteMember,
    getMembers,
    updateMember,
} from "../controllers/team.controller.js";
import authMiddleware, { requireAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getMembers);
router.post("/", authMiddleware, requireAdmin, createMember);
router.put("/:id", authMiddleware, requireAdmin, updateMember);
router.delete("/:id", authMiddleware, requireAdmin, deleteMember);

export default router;
