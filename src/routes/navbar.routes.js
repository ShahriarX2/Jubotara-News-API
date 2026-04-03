import express from "express";
import {
    createNavbarItem,
    deleteNavbarItem,
    getNavbarItems,
    updateNavbarItem,
} from "../controllers/navbar.controller.js";
import authMiddleware, { requireAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getNavbarItems);
router.post("/", authMiddleware, requireAdmin, createNavbarItem);
router.put("/:id", authMiddleware, requireAdmin, updateNavbarItem);
router.delete("/:id", authMiddleware, requireAdmin, deleteNavbarItem);

export default router;
